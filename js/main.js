// Sanitization function - escapes HTML to prevent XSS attacks
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

window.onload = loaded;

/**
 * Simple Function that will be run when the browser is finished loading.
 */
function loaded() {
    const form = document.getElementById('quickAddForm');
    if (form) {
        form.addEventListener('submit', handleQuickAdd);
    }
}

/**
 * Handle quick add form submission
 */
function handleQuickAdd(e) {
    e.preventDefault();
    
    const taskTitle = document.getElementById('taskTitle').value;
    const priority = document.getElementById('priority').value;
    
    // Sanitize user input before sending to AWS
    const sanitizedTask = {
        title: sanitizeInput(taskTitle.trim()),
        priority: priority
    };
    
    console.log('Sanitized task:', sanitizedTask);
    // TODO: Send sanitizedTask to AWS
    
    // Show success message
    const message = document.getElementById('message');
    message.textContent = 'Task added successfully!';
    message.className = 'message success';
    
    // Clear form
    e.target.reset();
}

/**
 * This function returns the string 'hello'
 * @return {string} the string hello
 */
export function sayHello() {
    return 'hello';
}
