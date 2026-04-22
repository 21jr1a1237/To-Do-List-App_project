let taskList = document.getElementById("taskList");
let input = document.getElementById("taskInput");
let filter = "all";

/* load */
window.onload = loadTasks;

/* enter key */
input.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

/* add */
function addTask() {
    let text = input.value.trim();
    if (!text) return;

    createTask(text);
    input.value = "";
    saveTasks();
}

/* create */
function createTask(text, completed = false) {
    let li = document.createElement("li");

    let span = document.createElement("span");
    span.innerText = text;

    if (completed) li.classList.add("completed");

    span.onclick = () => {
        li.classList.toggle("completed");
        saveTasks();
    };

    /* edit */
    span.ondblclick = () => {
        let edit = document.createElement("input");
        edit.value = span.innerText;
        edit.className = "edit-input";

        li.replaceChild(edit, span);
        edit.focus();

        edit.onblur = () => saveEdit(edit, span, li);
        edit.onkeypress = e => {
            if (e.key === "Enter") saveEdit(edit, span, li);
        };
    };

    /* delete */
    let del = document.createElement("button");
    del.innerText = "X";
    del.onclick = e => {
        e.stopPropagation();
        li.remove();
        saveTasks();
    };

    li.append(span, del);
    taskList.appendChild(li);

    updateCount();
}

/* save edit */
function saveEdit(edit, span, li) {
    span.innerText = edit.value;
    li.replaceChild(span, edit);
    saveTasks();
}

/* save */
function saveTasks() {
    let tasks = [];

    document.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").innerText,
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateCount();
}

/* load */
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(t => createTask(t.text, t.completed));
}

/* filter */
function filterTasks(type) {
    filter = type;

    document.querySelectorAll("li").forEach(li => {
        let isDone = li.classList.contains("completed");

        if (type === "all") li.style.display = "flex";
        else if (type === "active") li.style.display = !isDone ? "flex" : "none";
        else li.style.display = isDone ? "flex" : "none";
    });
}

/* clear completed */
function clearCompleted() {
    document.querySelectorAll(".completed").forEach(li => li.remove());
    saveTasks();
}

/* count */
function updateCount() {
    let total = document.querySelectorAll("li").length;
    let done = document.querySelectorAll(".completed").length;

    document.getElementById("count").innerText =
        `${done}/${total} completed`;
}