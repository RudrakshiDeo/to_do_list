document.addEventListener('DOMContentLoaded', (event) => {
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');

    addTaskButton.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskClick);

    loadTasks();

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            addTaskToDOM(task);
            saveTask(task);
            newTaskInput.value = '';
        }
    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        `;
        taskList.appendChild(li);
    }

    function handleTaskClick(e) {
        const li = e.target.closest('li');
        const taskId = li.dataset.id;

        if (e.target.tagName === 'INPUT') {
            toggleTaskCompleted(taskId, e.target.checked);
        } else if (e.target.classList.contains('edit')) {
            editTask(taskId, li);
        } else if (e.target.classList.contains('delete')) {
            deleteTask(taskId, li);
        } else if (e.target.classList.contains('save')) {
            saveEditedTask(taskId, li);
        }
    }

    function toggleTaskCompleted(taskId, completed) {
        const tasks = getTasks();
        const task = tasks.find(t => t.id == taskId);
        if (task) {
            task.completed = completed;
            saveTasks(tasks);
            const taskText = document.querySelector(`li[data-id="${taskId}"] .task-text`);
            taskText.classList.toggle('completed', completed);
        }
    }

    function editTask(taskId, li) {
        const taskText = li.querySelector('.task-text');
        const text = taskText.textContent;
        taskText.innerHTML = `<input type="text" value="${text}">`;
        li.querySelector('.edit').textContent = 'Save';
        li.querySelector('.edit').classList.add('save');
        li.querySelector('.edit').classList.remove('edit');
    }

    function saveEditedTask(taskId, li) {
        const input = li.querySelector('input[type="text"]');
        const newText = input.value.trim();
        if (newText !== '') {
            const tasks = getTasks();
            const task = tasks.find(t => t.id == taskId);
            if (task) {
                task.text = newText;
                saveTasks(tasks);
                const taskText = li.querySelector('.task-text');
                taskText.textContent = newText;
                li.querySelector('.save').textContent = 'Edit';
                li.querySelector('.save').classList.add('edit');
                li.querySelector('.save').classList.remove('save');
            }
        }
    }

    function deleteTask(taskId, li) {
        let tasks = getTasks();
        tasks = tasks.filter(t => t.id != taskId);
        saveTasks(tasks);
        li.remove();
    }

    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(addTaskToDOM);
    }
});