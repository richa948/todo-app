document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");

  const historyBtn = document.getElementById("history-btn");
  const historySection = document.getElementById("history-section");
  const historyList = document.getElementById("history-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let history = JSON.parse(localStorage.getItem("history")) || [];

  // Hide history when page loads
  historySection.style.display = "none";

  // Load tasks
  tasks.forEach((task) => renderTask(task));

  // Load history
  history.forEach((task) => renderHistory(task));

  // Toggle history
  historyBtn.addEventListener("click", () => {
    if (historySection.style.display === "none") {
      historySection.style.display = "block";
    } else {
      historySection.style.display = "none";
    }
  });

  // Add task
  addTaskButton.addEventListener("click", () => {
    const taskText = todoInput.value.trim();

    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    tasks.push(newTask);

    saveTasks();
    renderTask(newTask);

    todoInput.value = "";
  });

  function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <span>${task.text}</span>
      <button>Delete</button>
    `;

    // Toggle complete
    li.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;

      task.completed = !task.completed;
      li.classList.toggle("completed");

      saveTasks();
    });

    // Delete task
    li.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();

      // Move task to history
      history.push(task);
      saveHistory();
      renderHistory(task);

      // Remove from task list
      tasks = tasks.filter((t) => t.id !== task.id);

      li.remove();
      saveTasks();
    });

    todoList.appendChild(li);
  }

  function renderHistory(task) {
    const li = document.createElement("li");
    li.textContent = task.text;

    historyList.appendChild(li);
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function saveHistory() {
    localStorage.setItem("history", JSON.stringify(history));
  }
});
