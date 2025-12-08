window.onload = function() {
    const loadBtn = document.getElementById('loadAllTasks');
    const clearBtn = document.getElementById('clearCompleted');
    
    loadBtn.addEventListener('click', loadAllTasks);
    clearBtn.addEventListener('click', clearCompleted);
};

function loadAllTasks() {
    console.log('Loading ALL tasks from AWS...');
    // TODO: Retrieve ALL database entries from AWS
    
    const tbody = document.getElementById('tasksTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Loading tasks from AWS...</td></tr>';
    
    // Mock data load
    setTimeout(() => {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No tasks found. Add tasks from the Add Task page.</td></tr>';
        updateStats(0, 0, 0);
    }, 500);
}

function clearCompleted() {
    console.log('Deleting all completed tasks from AWS...');
    // TODO: Delete completed tasks from AWS
    
    const message = document.getElementById('manageMessage');
    message.textContent = 'Completed tasks deleted!';
    message.className = 'message success';
}

function updateStats(total, active, completed) {
    document.getElementById('totalCount').textContent = total;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('completedCount').textContent = completed;
}
