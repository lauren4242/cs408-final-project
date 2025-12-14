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
                filteredTasks = filteredTasks.filter(task => task.status === status);
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
    
    resultsContainer.innerHTML = validTasks.map(task => `
        <div class="task-card priority-${task.priority || 'medium'}">
            <h3>${task.title}</h3>
            <p>${task.description || 'No description'}</p>
            <div class="task-meta">
                <span class="badge badge-${task.category}">${task.category}</span>
                <span class="badge badge-${task.priority}">${task.priority}</span>
                <span class="badge badge-${task.status}">${task.status}</span>
                <span class="due-date">Due: ${task.dueDate}</span>
            </div>
        </div>
    `).join('');
}
