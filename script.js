// Retrieve todo from local storage or initialize an empty array.
// if we have smthng stored in our todo, then we don't want to lose it all on refreshing the page

// let is meant for values that are to be changed
// const is meant for values that don't need any later changes

// JS Object Notation : formats JS code to make it easily readable.

// collecting all the elements in different variables to change them accordingly!! heheheee

// Initial setup: Load todos from localStorage or initialize empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];

// DOM elements
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");
let currentFilter = "all"; // Default filter: show all tasks

// Initialize our project .....
// by listening to our webpage .... and the change
document.addEventListener("DOMContentLoaded", function () {
    // Add task on button click or pressing Enter
    addButton.addEventListener("click", addTask);                             // addTask will be a function that'll be executed whenever we click ADD
    todoInput.addEventListener("keydown", function (event) {                  // we take a argument bcz it is the input that is to be added as our task in todo list
        if (event.key === "Enter") {
            event.preventDefault();                                           // for inputs, the default is to refresh the page or track to a different page
            addTask();
        }
    });

    // Delete all tasks
    deleteButton.addEventListener("click", deleteAllTasks);

    // Handle filter button clicks using data attributes
    document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            currentFilter = btn.dataset.filter; // 'all', 'active', or 'completed'
            displayTasks();
        });
    });

    displayTasks(); // Initial render
});

// Add a new task
function addTask() {
    const newTask = todoInput.value.trim();                    //todoInput.value is the piece of text you enter , // trim() is a inbuilt function to delete all spaces at the end (just a safety feature)
    if (newTask !== "") {                                      // if the entered text is not empty
        todo.push({
            text: newTask,
            disabled: false, // false = active
        });
        saveToLocalStorage();
        todoInput.value = "";
        displayTasks();
    }
}

// Show tasks based on currentFilter: all | active | completed
function displayTasks() {
    todoList.innerHTML = "";

    const filtered = todo.filter((item) => {
        if (currentFilter === "active") return !item.disabled;
        if (currentFilter === "completed") return item.disabled;
        return true; // For 'all'
    });

    filtered.forEach((item, filteredIndex) => {
        const originalIndex = todo.indexOf(item);

        // Create the task element
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="todo-container">
                <input type="checkbox" class="todo-checkbox" id="input-${originalIndex}" ${item.disabled ? "checked" : ""}>
                <p id="todo-${originalIndex}" class="${item.disabled ? "disabled" : ""}" onclick="editTask(${originalIndex})">
                    ${item.text}
                </p>
            </div>
        `;

        // Add toggle listener
        li.querySelector(".todo-checkbox").addEventListener("change", () => {
            toggleTask(originalIndex);
        });

        todoList.appendChild(li);
    });

    todoCount.textContent = todo.length;
}

// Toggle task complete/incomplete
function toggleTask(index) {
    todo[index].disabled = !todo[index].disabled;
    saveToLocalStorage();
    displayTasks();
}

// Edit task in place
function editTask(index) {
    const todoText = document.getElementById(`todo-${index}`);
    const existingText = todo[index].text;

    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = existingText;
    inputElement.className = "input-edit";

    // Replace the text with input
    todoText.replaceWith(inputElement);
    inputElement.focus();

    // On blur or Enter, update task
    inputElement.addEventListener("blur", finishEdit);
    inputElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            inputElement.blur(); // Triggers blur logic
        }
    });

    function finishEdit() {
        const updatedText = inputElement.value.trim();
        if (updatedText) {
            todo[index].text = updatedText;
            saveToLocalStorage();
        }
        displayTasks(); // Re-render
    }
}

// Clear all tasks
function deleteAllTasks() {
    todo = [];
    saveToLocalStorage();
    displayTasks();
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(todo));
}
