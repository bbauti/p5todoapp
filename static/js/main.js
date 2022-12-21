// variables

const todoForm = document.querySelector("#addform");
const todoInput = document.querySelector("#addTodoForm");
const todoButton = document.querySelector("#sendtodo");
const todos = document.querySelector("#todos")
const progress = document.querySelector("#progress")
const progressText = document.querySelector("#progressText")
const editButton = document.querySelector("#progressText")

// local storage

const todosJson = localStorage.getItem('todos');
let lastid = localStorage.getItem('lastid') 

let todolist = []

if(todosJson){
    todolist = JSON.parse(todosJson);
}

// progress

let checked
let total

// checks for changes, updates progress and localstorage

function check() {
    todolist.forEach(function(i){
        let checkbox = document.getElementById(i.id)
        if (checkbox.checked) {
            i.checked = true
        } else {
            i.checked = false
        }
    })
    checked = document.querySelectorAll('input[type="checkbox"]:checked').length;
    total = document.querySelectorAll('input[type="checkbox"]').length;
    updateProgress()

    localStorage.setItem('todos', JSON.stringify(todolist));
}

// sorts items by checked status

function sort() {
    const order = [true, false];
    todolist.sort((x, y) => order.indexOf(x.checked) - order.indexOf(y.checked));
    console.log(todolist);
    check()
    printTodo()
}

// function to edit items. Changes icons, enables inputs 

function edit(id) {
    let todo = todolist.find(i => i.id === id);
    let text = document.getElementById("name"+id)
    let button = document.getElementById("button"+id)
    let icon = button.children[0]
    if (text.disabled == true) {
        text.disabled = false
        todo.editing = true
        icon.classList.remove('fa-pen-to-square')
        icon.classList.add('fa-floppy-disk')
        check() 
    } else {
        text.disabled = true
        todo.editing = false
        todo.text = text.value
        icon.classList.add('fa-pen-to-square')
        icon.classList.remove('fa-floppy-disk')
        check()
    }
}

function updateProgress() {
    progressText.innerHTML = `${checked} de ${total} completadas.`
    progress.max = total
    progress.value = checked
}

let cont = todolist.length || 0

// runs init function on startup, prints items and creates ids 

window.onload = init()

function init() {
    printTodo()
    check() 
    id=lastid++
    localStorage.setItem('lastid', id++);
}

// creates item

function createTodo(text, id, edit, status){
    //create li

    let li = document.createElement("li");
    li.classList.add('todo');

    //add checkbox

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id
    checkbox.name = id
    // check if checkbox is checked from localstorage
    if (status) {
        checkbox.checked = true
    }
    checkbox.setAttribute("onClick", "check()")


    // add text input

    let textInput = document.createElement("input");
    textInput.type = "text"
    textInput.classList.add('textInput')
    // check if input is being edited from localstorage
    if (edit == true) {
        textInput.disabled = false
    } else {
        textInput.disabled = true
    }
    textInput.id = "name"+id
    textInput.value = text

    // add button

    let button = document.createElement("button");
    button.type = "button"
    button.classList.add('btn')
    button.id = "button"+id
    button.setAttribute("onClick", `edit(${id})`)

    // add icon

    let icon = document.createElement("i");
    icon.classList.add('fa-solid')
    if (edit == true) {
        icon.classList.add('fa-floppy-disk')
    } else {
        icon.classList.add('fa-pen-to-square')
    }

    // append elements

    li.appendChild(checkbox);
    li.appendChild(textInput);
    button.appendChild(icon);
    li.appendChild(button);
    todos.appendChild(li);
}

todoForm.addEventListener("submit", addToList);

// deletes all childs from parent

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// adds new item to localstorage and item list

function addItem(text) {
    id=lastid++
    localStorage.setItem('lastid', id++);
    let todo = {
        text: text,
        id: id,
        editing: false,
        checked: false
    }
    todolist.push(todo)
} 

// deleted all checked items from html and localstorage

function deleteChecked() {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked')
    checkboxes.forEach(function(i){
        let parent = i.parentNode
        parent.remove()
    })
    todolist = todolist.filter(i => i.checked != true);
    localStorage.setItem('todos', JSON.stringify(todolist));
    check()
    printTodo()
}

function addToList(e) {
    // check if input has value
    if (todoInput.value === "") {
        // if not, trows error
        todoInput.classList.toggle("formerror");
        todoButton.classList.toggle("buttonerror");
        setTimeout(() => {
            todoInput.classList.toggle("formerror");
            todoButton.classList.toggle("buttonerror");
        }, 500);
    } else {
        // creates item and append to html and localstorage
        addItem(todoInput.value)
        printTodo()

        todoInput.value = "";
        localStorage.setItem('todos', JSON.stringify(todolist));
        check()

    }

    //stops form submit from reloading page

    e.preventDefault();
}

// deletes all previous items and appends all new ones to html

function printTodo() {
    removeAllChildNodes(todos)
    todolist.forEach(function(i){
        createTodo(i.text, i.id, i.editing, i.checked)
    })
}