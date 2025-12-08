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
        title: sanitizeInput(title.trim()),
        description: sanitizeInput(description.trim()),
        priority: priority,  // Safe - from dropdown
        category: category,  // Safe - from dropdown
        dueDate: dueDate     // Safe - date input
    };
    
    console.log('Sanitized task:', sanitizedTask);
    // TODO: Send sanitizedTask to AWS
    
    // Show success message
    const message = document.getElementById('formMessage');
    message.textContent = 'Task submitted successfully!';
    message.className = 'message success';
    
    // Clear form
    e.target.reset();
}
