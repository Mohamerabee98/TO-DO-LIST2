document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("task-input");
  const addBtn = document.getElementById("add-btn");
  const taskList = document.getElementById("task-list");

  addBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  loadTasks();

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      createTaskElement(taskText);
      taskInput.value = "";
      saveTasks();
      showToast("Task Added successfully");
    }
  }

  function createTaskElement(taskText, isCompleted = false) {
    const li = document.createElement("li");
    li.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = isCompleted;

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = taskText;
    if (isCompleted) {
      span.classList.add("completed");
    }

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";

    const saveBtn = document.createElement("button");
    saveBtn.className = "save-btn";
    saveBtn.textContent = "Save";
    saveBtn.style.display = "none";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    checkbox.addEventListener("change", function () {
      span.classList.toggle("completed");
      saveTasks();
    });

    deleteBtn.addEventListener("click", function () {
      li.remove();
      saveTasks();
      showToast("Task Deleted successfully");
    });

    editBtn.addEventListener("click", function () {
      const input = document.createElement("input");
      input.type = "text";
      input.value = span.textContent;
      input.className = "edit-input";

      li.replaceChild(input, span);
      input.focus(); // ✅ فوكس على الانبوت

      editBtn.style.display = "none";
      saveBtn.style.display = "inline-block";

      function saveChanges() {
        if (input.value.trim() !== "") {
          span.textContent = input.value.trim();
          li.replaceChild(span, input);
          editBtn.style.display = "inline-block";
          saveBtn.style.display = "none";
          saveTasks();
          showToast("Task Edited successfully");
        }
      }

      saveBtn.onclick = saveChanges;
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          saveChanges();
        }
      });
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(saveBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  }

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-item").forEach(function (taskItem) {
      tasks.push({
        text: taskItem.querySelector(".task-text").textContent,
        completed: taskItem.querySelector(".task-checkbox").checked,
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      tasks.forEach(function (task) {
        createTaskElement(task.text, task.completed);
      });
    }
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("show");
    }, 100);

    setTimeout(function () {
      toast.classList.remove("show");
      toast.remove();
    }, 3000);
  }
});
