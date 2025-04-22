document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    
    // تحميل المهام من localStorage إذا وجدت
    loadTasks();
    
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            createTaskElement(taskText);
            taskInput.value = '';
            saveTasks();
        }
    }
    
    function createTaskElement(taskText, isCompleted = false) {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = isCompleted;
        checkbox.addEventListener('change', function() {
            span.classList.toggle('completed');
            saveTasks();
        });
        
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = taskText;
        if (isCompleted) {
            span.classList.add('completed');
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function() {
            li.remove();
            saveTasks();
        });
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
        
        return li;
    }
    
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(function(taskItem) {
            tasks.push({
                text: taskItem.querySelector('.task-text').textContent,
                completed: taskItem.querySelector('.task-checkbox').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(function(task) {
                createTaskElement(task.text, task.completed);
            });
        }
    }
});