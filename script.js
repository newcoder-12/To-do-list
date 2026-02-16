let input = document.getElementById("taskInput");
let addTaskButton = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");

// Button click
addTaskButton.addEventListener("click", () => addTask());

// Enter key press
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTask(text = null, completed = false, date = null) {
  let getValue = text !== null ? text : input.value.trim();

  if (getValue === "") {
    alert("Please enter a task.");
    return;
  }

  // Create list item
  let listItem = document.createElement("li");
  const span = document.createElement("span");
  const now = date || new Date().toLocaleString();
  listItem.dataset.date = now;

  span.innerText = getValue;
  listItem.appendChild(span);
  const dateSpan = document.createElement("small");
  dateSpan.innerText = now;
  listItem.appendChild(dateSpan);

  // Delete button
  const dltBtn = document.createElement("button");
  dltBtn.innerText = "Delete";
  dltBtn.classList.add("delete-btn");

  listItem.appendChild(dltBtn);
  taskList.appendChild(listItem);

  // Clear input
  input.value = "";

  // Delete on click
  dltBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent marking as completed
    listItem.remove();
    saveTasks();
  });

  //Add a box to the left of each task that can be checked off when the task is completed
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  listItem.prepend(checkBox);

  if (completed) {
    listItem.classList.add("completed");
    checkBox.checked = true;
  }

  //Toggle completed class on checkbox change
  checkBox.addEventListener("change", () => {
    listItem.classList.toggle("completed");
    saveTasks();
  });

  saveTasks();
}

//save to local storage so that the tasks persist even after the page is refreshed.
//You can use JSON to store the tasks as an array of objects, where each object represents a task with properties like "text" and "completed".

function saveTasks() {
  const allTasks = [];

  document.querySelectorAll("li").forEach((li) => {
    allTasks.push({
      text: li.querySelector("span").innerText,
      completed: li.classList.contains("completed"),
      date: li.dataset.date || new Date().toISOString(),
    });
  });

  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    addTask(task.text, task.completed, task.date);

    // If completed, move last added task to archive
    if (task.completed) {
      const lastTask = taskList.lastElementChild;
      document.getElementById("archiveList").appendChild(lastTask);
    }
  });
}

//create a archive area below the task list where completed tasks are moved to when they are checked off, instead of being deleted

taskList.addEventListener("change", (e) => {
  if (e.target.type === "checkbox" && e.target.checked) {
    const completedTask = e.target.parentElement; //its parent element is the <li> that holds the task.
    document.getElementById("archiveList").appendChild(completedTask); // Move to archive
    saveTasks();
  }
});

//if the users unchecks a task in the archive area, it should move back to the main task list
document.getElementById("archiveList").addEventListener("change", (e) => {
  if (e.target.type === "checkbox" && !e.target.checked) {
    const uncompletedTask = e.target.parentElement; //its parent element is the <li> that holds the task.
    document.getElementById("taskList").appendChild(uncompletedTask); // Move back to main list
    saveTasks();
  }
});

loadTasks();

//FOR DISPLAYING THE CURRENT DATE ON THE TOP OF THE PAGE
const dateSpan = document.querySelector(".date-display");
const today = new Date().toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});
dateSpan.innerText = "Date : " + today;