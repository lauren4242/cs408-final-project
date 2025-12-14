// Sanitization function - escapes HTML to prevent XSS attacks
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

window.onload = function() {
    const form = document.getElementById('addTaskForm');
    form.addEventListener('submit', handleSubmit);
};

function handleSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priorityLevel').value;
    const category = document.getElementById('category').value;
    const dueDate = document.getElementById('dueDate').value;
    
    // Sanitize all text inputs
    const sanitizedTask = {
        id: Date.now().toString(), // Generate unique ID
        title: sanitizeInput(title.trim()),
        description: sanitizeInput(description.trim()),
        priority: priority,  // Safe - from dropdown
        category: category,  // Safe - from dropdown
        dueDate: dueDate,    // Safe - date input
        status: 'pending',   // Default status for new tasks
        createdAt: new Date().toISOString()
    };
    
    console.log('Sanitized task:', sanitizedTask);
    
    // Send sanitizedTask to AWS
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        const message = document.getElementById('formMessage');
        if (xhr.status >= 200 && xhr.status < 300) {
            // Store task ID in localStorage for later retrieval
            let taskIds = JSON.parse(localStorage.getItem('taskIds') || '[]');
            taskIds.push(sanitizedTask.id);
            localStorage.setItem('taskIds', JSON.stringify(taskIds));
            
            message.textContent = 'Task submitted successfully!';
            message.className = 'message success';
            e.target.reset();
        } else {
            message.textContent = 'Error submitting task. Please try again.';
            message.className = 'message error';
        }
    });
    xhr.addEventListener("error", function () {
        const message = document.getElementById('formMessage');
        message.textContent = 'Network error. Please check your connection.';
        message.className = 'message error';
    });
    xhr.open("PUT", "https://dpxlw1jjt8.execute-api.us-east-2.amazonaws.com/todo");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(sanitizedTask));
}
