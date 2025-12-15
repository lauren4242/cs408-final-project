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
    
    // Sanitize user input and add all required fields with defaults
    const sanitizedTask = {
        id: Date.now().toString(),
        title: sanitizeInput(taskTitle.trim()),
        description: '', // Default empty description
        priority: priority,
        category: 'tasks', // Default category
        dueDate: new Date().toISOString().split('T')[0], // Default to today
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    console.log('Sanitized task:', sanitizedTask);
    
    // Send sanitizedTask to AWS
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        const message = document.getElementById('message');
        if (xhr.status >= 200 && xhr.status < 300) {
            // Store task ID in localStorage
            let taskIds = JSON.parse(localStorage.getItem('taskIds') || '[]');
            taskIds.push(sanitizedTask.id);
            localStorage.setItem('taskIds', JSON.stringify(taskIds));
            
            message.textContent = 'Task added successfully!';
            message.className = 'message success';
            e.target.reset();
        } else {
            message.textContent = 'Error adding task. Please try again.';
            message.className = 'message error';
        }
    });
    xhr.addEventListener("error", function () {
        const message = document.getElementById('message');
        message.textContent = 'Network error. Please check your connection.';
        message.className = 'message error';
    });
    xhr.open("PUT", "https://dpxlw1jjt8.execute-api.us-east-2.amazonaws.com/todo");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(sanitizedTask));
}

/**
 * This function returns the string 'hello'
 * @return {string} the string hello
 */
export function sayHello() {
    return 'hello';
}
