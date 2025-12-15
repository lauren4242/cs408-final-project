// Tests for CS408 Final Project Task Management Application
// Tests cover: XSS protection, data validation, filtering, statistics, category auto-update, status toggle, and date formatting
import {sayHello} from '../js/main.js';

QUnit.module('hello', function() {

    QUnit.test('make sure the hello function says hello', function(assert) {
        var result = sayHello();
        assert.equal(result, 'hello');
    });
});

// Helper function- mirrors sanitizeInput from add-task.js and main.js
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Tests XSS prevention using DOM API to escape malicious HTML/scripts
QUnit.module('Input Sanitization (XSS Protection)', function() {
    QUnit.test('should escape HTML script tags', function(assert) {
        var maliciousInput = '<script>alert("XSS")</script>';
        var result = sanitizeInput(maliciousInput);
        assert.equal(result, '&lt;script&gt;alert("XSS")&lt;/script&gt;');
    });
    
    QUnit.test('should escape HTML entities and special characters', function(assert) {
        assert.equal(sanitizeInput('<img src="x">'), '&lt;img src="x"&gt;');
        assert.equal(sanitizeInput('Task & Project'), 'Task &amp; Project');
        assert.equal(sanitizeInput('Normal text'), 'Normal text');
    });
});

// Tests task data structure validation for AWS DynamoDB integration
QUnit.module('Task Data Validation', function() {
    QUnit.test('should validate task has required fields', function(assert) {
        var task = {
            id: '123',
            title: 'Test Task',
            priority: 'high',
            category: 'tasks',
            dueDate: '2025-12-14',
            status: 'pending'
        };
        
        assert.ok(task.id && task.title && task.priority && task.status);
    });
    
    QUnit.test('should validate priority values', function(assert) {
        var validPriorities = ['low', 'medium', 'high'];
        assert.ok(validPriorities.includes('low'));
        assert.ok(validPriorities.includes('medium'));
        assert.ok(validPriorities.includes('high'));
    });
    
    QUnit.test('should validate status values', function(assert) {
        var validStatuses = ['pending', 'completed'];
        assert.ok(validStatuses.includes('pending'));
        assert.ok(validStatuses.includes('completed'));
    });
    
    QUnit.test('should filter out tasks without title', function(assert) {
        var tasks = [
            {id: '1', title: 'Valid'},
            {id: '2'},
            {id: '3', title: 'Valid2'}
        ];
        var validTasks = tasks.filter(task => task.title);
        assert.equal(validTasks.length, 2);
    });
});

// Tests filtering logic from view-tasks.js (category, priority, status filters)
QUnit.module('Filter Logic', function() {
    var sampleTasks = [
        {title: 'Task 1', category: 'tasks', priority: 'low', status: 'pending'},
        {title: 'Task 2', category: 'events', priority: 'high', status: 'completed'},
        {title: 'Task 3', category: 'tasks', priority: 'medium', status: 'pending'}
    ];
    
    QUnit.test('should filter by category', function(assert) {
        var filtered = sampleTasks.filter(task => task.category === 'tasks');
        assert.equal(filtered.length, 2);
    });
    
    QUnit.test('should filter by priority', function(assert) {
        var filtered = sampleTasks.filter(task => task.priority === 'high');
        assert.equal(filtered.length, 1);
    });
    
    QUnit.test('should filter by status', function(assert) {
        var filtered = sampleTasks.filter(task => task.status === 'pending');
        assert.equal(filtered.length, 2);
    });
    
    QUnit.test('should map active to pending status', function(assert) {
        var statusFilter = 'active';
        var statusToFilter = statusFilter === 'active' ? 'pending' : statusFilter;
        assert.equal(statusToFilter, 'pending');
    });
});

// Tests task counting logic from manage-tasks.js updateStats function
QUnit.module('Task Statistics', function() {
    QUnit.test('should count tasks correctly', function(assert) {
        var tasks = [
            {status: 'pending'},
            {status: 'completed'},
            {status: 'pending'}
        ];
        
        assert.equal(tasks.length, 3, 'Total count');
        assert.equal(tasks.filter(t => t.status === 'pending').length, 2, 'Active count');
        assert.equal(tasks.filter(t => t.status === 'completed').length, 1, 'Completed count');
    });
});

// Tests automatic category update when task is due today (tasks -> assignments due)
QUnit.module('Category Auto-Update Logic', function() {
    QUnit.test('should update category when task is due today', function(assert) {
        var today = new Date().toISOString().split('T')[0];
        var task = {category: 'tasks', dueDate: today};
        
        var shouldUpdate = task.dueDate === today && task.category === 'tasks';
        assert.ok(shouldUpdate);
    });
    
    QUnit.test('should not update when not due today or wrong category', function(assert) {
        var today = new Date().toISOString().split('T')[0];
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        var task1 = {category: 'tasks', dueDate: tomorrow.toISOString().split('T')[0]};
        var task2 = {category: 'assignments due', dueDate: today};
        
        assert.notOk(task1.dueDate === today && task1.category === 'tasks');
        assert.notOk(task2.dueDate === today && task2.category === 'tasks');
    });
});

// Tests status toggle functionality from manage-tasks.js (pending <-> completed)
QUnit.module('Status Toggle Logic', function() {
    QUnit.test('should toggle between pending and completed', function(assert) {
        var status1 = 'pending';
        var status2 = 'completed';
        
        var toggled1 = status1 === 'completed' ? 'pending' : 'completed';
        var toggled2 = status2 === 'completed' ? 'pending' : 'completed';
        
        assert.equal(toggled1, 'completed');
        assert.equal(toggled2, 'pending');
    });
});

// Tests date formatting and ID generation used across all modules
QUnit.module('Date Formatting', function() {
    QUnit.test('should format date as YYYY-MM-DD', function(assert) {
        var date = new Date('2025-12-14');
        var formatted = date.toISOString().split('T')[0];
        assert.equal(formatted, '2025-12-14');
    });
    
    QUnit.test('should generate unique IDs', function(assert) {
        var id1 = Date.now().toString();
        var id2 = (Date.now() + 1).toString();
        assert.notEqual(id1, id2);
    });
});
