const form = document.querySelector('form')
const input = document.querySelector('input')

const todos_container = document.querySelector('.todos-container')

let editMode = false

const getLS = () => JSON.parse(localStorage.getItem('todos')) || []

let todos = getLS()

function loadTodos () {
    if (todos == []) return

    todos_container.innerHTML = todos.map(item => {
        return `
            <div class="todo-item ${item.completed ? 'done' : ''}" data-id="${item.id}">
                <p class="todo-text">${item.value}</p>
                <div class="settings-icons">
                    <p class="todo-date">${item.date}</p>
                    <i onclick="handleEdit(event)" class="fa-solid fa-pen-to-square"></i>
                    <i onclick="handleDone(event)" class="fa-solid fa-circle-check"></i>
                    <i onclick="handleDelete(event)" class="fa-solid fa-circle-xmark"></i>
                </div>
            </div>
        `
    }).join('')
}

window.addEventListener('load', () => {
    loadTodos()

    allBtn.classList.add('active-tab')
    doneBtn.classList.remove('active-tab')
    notDoneBtn.classList.remove('active-tab')
})

form.addEventListener('submit', e => {
    e.preventDefault()

    if (editMode) return

    if (input.value.trim() == '') return

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    const childObj = {
        value: input.value,
        date: today,
        completed: false,
        id: Date.now()
    }

    const todo_item_el = document.createElement('div')
    todo_item_el.classList.add('todo-item')
    todo_item_el.setAttribute('data-id', childObj.id)
    todo_item_el.innerHTML = `
        <p class="todo-text">${childObj.value}</p>
        <div class="settings-icons">
            <p class="todo-date">${childObj.date}</p>
            <i onclick="handleEdit(event)" class="fa-solid fa-pen-to-square"></i>
            <i onclick="handleDone(event)" class="fa-solid fa-circle-check"></i>
            <i onclick="handleDelete(event)" class="fa-solid fa-circle-xmark"></i>
        </div>
    `

    todos.push(childObj)

    localStorage.setItem('todos', JSON.stringify(todos))

    todos_container.appendChild(todo_item_el)

    input.value = ''
})

const handleEdit = (e) => {
    editMode = true
    input.value = e.target.parentElement.previousElementSibling.innerText
    input.nextElementSibling.innerText = 'Edit Todo'
    input.focus()

    document.querySelector('.cancel-edit-mode').style.display = 'block'

    form.addEventListener('submit', () => {
        if (input.value.trim() == '') return

        e.target.parentElement.previousElementSibling.innerText = input.value
        input.nextElementSibling.innerText = 'Add Todo'

        todos.forEach(todo => {
            if (todo.id == e.target.parentElement.previousElementSibling.parentElement.getAttribute('data-id')) {
                todo.value = input.value
            }
        })

        localStorage.setItem('todos', JSON.stringify(todos))

        editMode = false
    })
}

const handleDone = (e) => {
    todos.forEach(todo => {
        if (todo.id == e.target.parentElement.previousElementSibling.parentElement.getAttribute('data-id')) {
            todo.completed = !todo.completed
            if (todo.completed) {
                e.target.parentElement.previousElementSibling.parentElement.classList.add('done')
            } else {
                e.target.parentElement.previousElementSibling.parentElement.classList.remove('done')
            }
        }
    })

    localStorage.setItem('todos', JSON.stringify(todos))
}

const handleDelete = (e) => {
    todos.forEach(todo => {
        if (todo.id == e.target.parentElement.previousElementSibling.parentElement.getAttribute('data-id')) {
            todos.splice(todos.indexOf(todo), 1)
        }
    })

    localStorage.setItem('todos', JSON.stringify(todos))
    
    loadTodos()
}


const allBtn = document.querySelector('.tabs .all')
const doneBtn = document.querySelector('.tabs .done')
const notDoneBtn = document.querySelector('.tabs .not_done')

allBtn.addEventListener('click', () => {
    allBtn.classList.add('active-tab')
    doneBtn.classList.remove('active-tab')
    notDoneBtn.classList.remove('active-tab')
    loadTodos()
})

doneBtn.addEventListener('click', () => {
    const filter = todos.filter(todo => todo.completed)
    
    todos_container.innerHTML = filter.map(item => {
        return `
            <div class="todo-item ${item.completed ? 'done' : ''}" data-id="${item.id}">
                <p class="todo-text">${item.value}</p>
                <div class="settings-icons">
                    <p class="todo-date">${item.date}</p>
                </div>
            </div>
        `
    }).join('')

    allBtn.classList.remove('active-tab')
    doneBtn.classList.add('active-tab')
    notDoneBtn.classList.remove('active-tab')
})

notDoneBtn.addEventListener('click', () => {
    const filter = todos.filter(todo => !todo.completed)
    
    todos_container.innerHTML = filter.map(item => {
        return `
            <div class="todo-item ${item.completed ? 'done' : ''}" data-id="${item.id}">
                <p class="todo-text">${item.value}</p>
                <div class="settings-icons">
                    <p class="todo-date">${item.date}</p>
                </div>
            </div>
        `
    }).join('')

    allBtn.classList.remove('active-tab')
    doneBtn.classList.remove('active-tab')
    notDoneBtn.classList.add('active-tab')
})

document.querySelector('.cancel-edit-mode').addEventListener('click', () => {
    editMode = false
    input.value = ''
    input.nextElementSibling.innerText = 'Add Todo'

    document.querySelector('.cancel-edit-mode').style.display = 'none'
})