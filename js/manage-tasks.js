window.onload = function() {
    const loadBtn = document.getElementById('loadAllTasks');
    const clearBtn = document.getElementById('clearCompleted');
    
    loadBtn.addEventListener('click', loadAllTasks);
    clearBtn.addEventListener('click', clearCompleted);
    
    // Make functions globally accessible for onclick handlers
    window.deleteTask = deleteTask;
    window.toggleStatus = toggleStatus;
};

// Helper function to check if task is due today and update category if needed
function checkAndUpdateCategory(task) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    // If task is due today and category is 'tasks', update it to 'assignments due'
    if (task.dueDate === today && task.category === 'tasks') {
        // Update the task in AWS
        let xhr = new XMLHttpRequest();
        xhr.open("PUT", "https://dpxlw1jjt8.execute-api.us-east-2.amazonaws.com/todo");
        xhr.setRequestHeader("Content-Type", "application/json");
        
        // Create updated task object
        const updatedTask = {
            ...task,
            category: 'assignments due'
        };
        
        xhr.send(JSON.stringify(updatedTask));
        
        // Return updated task for display
        return updatedTask;
    }
    
    return task;
}

function loadAllTasks() {
    const tbody = document.getElementById('tasksTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Loading tasks from AWS...</td></tr>';
    
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            const tasks = JSON.parse(xhr.response);
            const validTasks = tasks.filter(task => task.title);
        
            if (validTasks.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No tasks found. Add tasks from the Add Task page.</td></tr>';
                updateStats(0, 0, 0);
            } else {
                tbody.innerHTML = '';
                
                let activeCount = 0;
                let completedCount = 0;
                
                validTasks.forEach(task => {
                    // Check and update category if due today
                    task = checkAndUpdateCategory(task);
                    
                    if (task.status === 'completed') {
                        completedCount++;
                    } else {
                        activeCount++;
                    }
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.title}</td>
                        <td>${task.category}</td>
                        <td><span class="badge badge-${task.priority}">${task.priority}</span></td>
                        <td><span class="badge badge-${task.status}">${task.status}</span></td>
                        <td>${task.dueDate}</td>
                        <td>
                            <button class="btn-action" onclick="toggleStatus('${task.id}', '${task.status}')">
                                ${task.status === 'completed' ? 'Reopen' : 'Complete'}
                            </button>
                            <button class="btn-delete" onclick="deleteTask('${task.id}')">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
                
                updateStats(validTasks.length, activeCount, completedCount);
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Error loading tasks. Please try again.</td></tr>';
            updateStats(0, 0, 0);
        }
    });
    xhr.addEventListener("error", function () {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Network error. Please check your connection.</td></tr>';
        updateStats(0, 0, 0);
    });
    xhr.open("GET", "https://dpxlw1jjt8.execute-api.us-east-2.amazonaws.com/todo");
    xhr.send();
}

function clearCompleted() {
    const message = document.getElementById('manageMessage');
    message.textContent = 'Checking for completed tasks...';
    message.className = 'message';
    
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            const tasks = JSON.parse(xhr.response);
            const completedTasks = tasks.filter(task => task.status === 'completed');
            
            if (completedTasks.length === 0) {
                message.textContent = 'No completed tasks to delete.';
                message.className = 'message';
                return;
            }
            
            let deleteCount = 0;
            completedTasks.forEach(task => {
                let deleteXhr = new XMLHttpRequest();
                deleteXhr.addEventListener("load", function () {
                    deleteCount++;
                    if (deleteCount === completedTasks.length) {
                        message.textContent = `${deleteCount} completed task(s) deleted!`;
                        message.className = 'message success';
                        loadAllTasks();
                    }
                });
                deleteXhr.open("DELETE", "https://dpxlw1jjt8.execute-api.us-east-2.amazonaws.com/todo/" + task.id);
                deleteXhr.setRequestHeader("Content-Type", "application/json");
                deleteXhr.send();
            });
        } else {
            message.textContent = 'Error loading tasks. Please try again.';
            message.className = 'message error';
        }
    });
    xhr.open("GET", "https://dpxlw1jjt8.execute-api.us-east-2.amazonaws.com/todo");
    xhr.send();
}

function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            const message = document.getElementById('manageMessage');
            message.textContent = 'Task deleted!';
            message.className = 'message success';
            loadAllTasks();
        }
    });
    xhr.open("DELETE", "https://dpxlw1jjt8.execute-api.us-east-2.amazonaws.com/todo/" + taskId);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function toggleStatus(taskId, currentStatus) {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    // First, get the full task object
    let getXhr = new XMLHttpRequest();
    getXhr.addEventListener("load", function () {
        if (getXhr.status >= 200 && getXhr.status < 300) {
            const task = JSON.parse(getXhr.response);
            
            // Update the status
            task.status = newStatus;
            
            // Save the updated task back to AWS
            let putXhr = new XMLHttpRequest();
            putXhr.addEventListener("load", function () {
                if (putXhr.status >= 200 && putXhr.status < 300) {
                    const message = document.getElementById('manageMessage');
                    message.textContent = `Task marked as ${newStatus}!`;
                    message.className = 'message success';
                    loadAllTasks(); // Reload the table
                }
            });
            putXhr.open("PUT", "https://dpxlw1jjt8.execute-api.us-east-2.amazonaws.com/todo");
            putXhr.setRequestHeader("Content-Type", "application/json");
            putXhr.send(JSON.stringify(task));
        }
    });
    getXhr.open("GET", "https://dpxlw1jjt8.execute-api.us-east-2.amazonaws.com/todo/" + taskId);
    getXhr.send();
}

function updateStats(total, active, completed) {
    document.getElementById('totalCount').textContent = total;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('completedCount').textContent = completed;
}
