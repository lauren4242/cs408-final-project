window.onload = function() {
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', handleSearch);
};

function handleSearch() {
    const category = document.getElementById('filterCategory').value;
    const priority = document.getElementById('filterPriority').value;
    const status = document.getElementById('filterStatus').value;
    
    const resultsCount = document.getElementById('resultsCount');
    resultsCount.textContent = 'Searching AWS database...';
    
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            const tasks = JSON.parse(xhr.response);
            
            // Filter tasks based on selected criteria
            let filteredTasks = tasks;
            
            if (category !== '' && category !== 'all') {
                filteredTasks = filteredTasks.filter(task => task.category === category);
            }
            if (priority !== '' && priority !== 'all') {
                filteredTasks = filteredTasks.filter(task => task.priority === priority);
            }
            if (status !== '' && status !== 'all') {
                // Map "active" to "pending" since that's the actual status value
                const statusToFilter = status === 'active' ? 'pending' : status;
                filteredTasks = filteredTasks.filter(task => task.status === statusToFilter);
            }
            
            displayResults(filteredTasks);
            resultsCount.textContent = `Found ${filteredTasks.length} task(s) matching your filters.`;
        } else {
            resultsCount.textContent = 'Error loading tasks. Please try again.';
        }
    });
    xhr.addEventListener("error", function () {
        resultsCount.textContent = 'Network error. Please check your connection.';
    });
    xhr.open("GET", "https://dpxlw1jjt8.execute-api.us-east-2.amazonaws.com/todo");
    xhr.send();
}

function displayResults(tasks) {
    const resultsContainer = document.getElementById('filteredResults');
    
    if (!resultsContainer) {
        return;
    }
    
    // Filter out incomplete tasks
    const validTasks = tasks.filter(task => task.title);
    
    if (validTasks.length === 0) {
        resultsContainer.innerHTML = '<p class="empty-state">No tasks found matching your filters.</p>';
        return;
    }
    
    // Check and update categories for tasks due today
    const today = new Date().toISOString().split('T')[0];
    validTasks.forEach(task => {
        if (task.dueDate === today && task.category === 'tasks') {
            // Update in AWS
            let xhr = new XMLHttpRequest();
            xhr.open("PUT", "https://dpxlw1jjt8.execute-api.us-east-2.amazonaws.com/todo");
            xhr.setRequestHeader("Content-Type", "application/json");
            task.category = 'assignments due';
            xhr.send(JSON.stringify(task));
        }
    });
    
    resultsContainer.innerHTML = validTasks.map(task => `
        <div class="task-display-card priority-${task.priority || 'medium'}">
            <div class="task-card-header">
                <h3>${task.title}</h3>
                <span class="badge badge-${task.priority}">${task.priority}</span>
            </div>
            <div class="task-card-body">
                <p class="task-description"><strong>Description:</strong> ${task.description || 'No description'}</p>
                <div class="task-details">
                    <span><strong>Category:</strong> ${task.category}</span>
                    <span><strong>Status:</strong> ${task.status}</span>
                </div>
                <div class="due-date"><strong>📅 Due:</strong> ${task.dueDate}</div>
            </div>
        </div>
    `).join('');
}
