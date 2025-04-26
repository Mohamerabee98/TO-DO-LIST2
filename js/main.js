class TodoApp {
  constructor() {
    this.taskInput = document.getElementById("task-input");
    this.addBtn = document.getElementById("add-btn");
    this.taskList = document.getElementById("task-list");

    this.addBtn.addEventListener("click", () => this.addTask());
    this.taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addTask();
      }
    });

    this.loadTasks();
  }

  addTask() {
    const taskText = this.taskInput.value.trim();
    if (taskText !== "") {
      this.createTaskElement(taskText);
      this.taskInput.value = ""; 
      this.saveTasks();
      this.showToast("Task Added successfully");
    }
  }

  createTaskElement(taskText, isCompleted = false) {
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

    checkbox.addEventListener("change", () => {
      span.classList.toggle("completed");
      this.saveTasks();
    });

    deleteBtn.addEventListener("click", () => {
      li.remove();
      this.saveTasks();
      this.showToast("Task Deleted successfully");
    });

    editBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = span.textContent;
      input.className = "edit-input";

      li.replaceChild(input, span);
      input.focus();

      editBtn.style.display = "none";
      saveBtn.style.display = "inline-block";

      const saveChanges = () => {
        if (input.value.trim() !== "") {
          span.textContent = input.value.trim();
          li.replaceChild(span, input);
          editBtn.style.display = "inline-block";
          saveBtn.style.display = "none";
          this.saveTasks();
          this.showToast("Task Edited successfully");
        }
      };

      saveBtn.onclick = saveChanges;

      input.addEventListener("keypress", (e) => {
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
    this.taskList.appendChild(li);
  }


  saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-item").forEach((taskItem) => {
      tasks.push({
        text: taskItem.querySelector(".task-text").textContent,
        completed: taskItem.querySelector(".task-checkbox").checked,
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      tasks.forEach((task) => {
        this.createTaskElement(task.text, task.completed);
      });
    }
  }

  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      toast.remove();
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TodoApp();
});
