const loginBtn = document.getElementById("loginBtn");
const guestBtn = document.getElementById("guestBtn");
const logoutBtn = document.getElementById("logoutBtn");
const emailInput = document.getElementById("emailInput");
const loginArea = document.querySelector(".login-area");
const todoContainer = document.querySelector(".todo-container");

const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const progressBar = document.getElementById("progressBar");
const themeToggle = document.getElementById("themeToggle");

let currentUser = null;
let isGuest = false;

/* THEME */
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
});

if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
}

/* LOGIN */
loginBtn.onclick = () => {
  if (!emailInput.value.trim()) return;
  currentUser = emailInput.value;
  isGuest = false;
  loginArea.style.display = "none";
  todoContainer.style.display = "block";
  loadTasks();
};

guestBtn.onclick = () => {
  isGuest = true;
  loginArea.style.display = "none";
  todoContainer.style.display = "block";
};

logoutBtn.onclick = () => location.reload();

/* TASKS */
addBtn.onclick = addTask;
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  if (!taskInput.value.trim()) return;

  createTask(taskInput.value, categorySelect.value, false);
  saveTasks();
  taskInput.value = "";
  updateStats();
}

function createTask(text, category, completed) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = text;

  span.onclick = () => {
    li.classList.toggle("completed");
    saveTasks();
    updateStats();
  };

  const tag = document.createElement("span");
  tag.className = `tag ${category}`;
  tag.textContent = category;

  const actions = document.createElement("div");
  actions.className = "actions";

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.onclick = () => {
    const t = prompt("Edit task", span.textContent);
    if (t) span.textContent = t;
    saveTasks();
  };

  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.onclick = () => {
    li.remove();
    saveTasks();
    updateStats();
  };

  actions.append(editBtn, delBtn);
  li.append(span, tag, actions);
  taskList.appendChild(li);
  updateStats();
}

function updateStats() {
  const total = taskList.children.length;
  const completed = document.querySelectorAll(".completed").length;
  taskCount.textContent = `${completed} / ${total} completed`;
  progressBar.style.width = total ? `${(completed / total) * 100}%` : "0%";
}

function saveTasks() {
  if (isGuest) return;

  const tasks = [];
  document.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      category: li.querySelector(".tag").textContent,
      completed: li.classList.contains("completed")
    });
  });

  localStorage.setItem(currentUser, JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  tasks.forEach(t => createTask(t.text, t.category, t.completed));
}
