const addBtn = document.getElementById("addTaskBtn")
const taskInput = document.getElementById("taskInput")
const taskList = document.getElementById("taskList")

let tasks = []

// Load saved tasks
window.addEventListener("DOMContentLoaded", () => {

    let savedTasks = localStorage.getItem("tasks")

    if(savedTasks){
        tasks = JSON.parse(savedTasks)
        renderTasks()
    }

})


// Add task
addBtn.addEventListener("click", () => {

    let taskText = taskInput.value.trim()

    if(taskText === "") return

    let task = {
        text: taskText,
        completed: false
    }

    tasks.push(task)

    saveTasks()
    renderTasks()

    taskInput.value = ""

})


// Save tasks
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

taskInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        addBtn.click()
    }

})

let draggedIndex = null

taskList.addEventListener("dragstart", (e) => {

    draggedIndex = [...taskList.children].indexOf(e.target)

})

taskList.addEventListener("dragover", (e) => {

    e.preventDefault()

})

taskList.addEventListener("drop", (e) => {

    let targetIndex = [...taskList.children].indexOf(e.target.closest("li"))

    if(targetIndex === -1) return

    let draggedTask = tasks.splice(draggedIndex, 1)[0]

    tasks.splice(targetIndex, 0, draggedTask)

    saveTasks()
    renderTasks()

})

let currentFilter = "all"

const filterButtons = document.querySelectorAll(".filters button")

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter

        renderTasks()

    })

})


// Render tasks
function renderTasks(){

    taskList.innerHTML = ""

    tasks.forEach((task, index) => {

        if(currentFilter === "active" && task.completed) return
        if(currentFilter === "completed" && !task.completed) return

        let li = document.createElement("li")
        li.draggable = true

        // Checkbox
        let checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.checked = task.completed

        checkbox.addEventListener("change", () => {

            tasks[index].completed = checkbox.checked
            saveTasks()
            renderTasks()

        })


        // Task text
        let span = document.createElement("span")
        span.textContent = task.text

        if(task.completed){
            span.style.textDecoration = "line-through"
        }


        // Delete button
        let deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Delete"

        deleteBtn.addEventListener("click", () => {

            tasks.splice(index, 1)
            saveTasks()
            renderTasks()

        })


        li.appendChild(checkbox)
        li.appendChild(span)
        li.appendChild(deleteBtn)

        taskList.appendChild(li)

    })
    const counter = document.getElementById("taskCounter")
    let remaining = tasks.filter(task => !task.completed).length
    counter.textContent = remaining + " tasks remaining"


}
