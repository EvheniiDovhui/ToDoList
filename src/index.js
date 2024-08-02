import icon from './public/guava.svg'

const button = document.querySelector('.add-btn')
const input = document.querySelector('.input')
const todoList = document.querySelector('.todo-list')

let editingTodo = null

// Функція для збереження завдань у localStorage
function saveTodos() {
	const todos = Array.from(todoList.children).map(todo => ({
		text: todo.querySelector('.todo-text').textContent,
		time: todo.querySelector('.todo-time').textContent,
		checked: todo.classList.contains('checked'),
		edited: todo.querySelector('.edited') ? true : false,
	}))
	localStorage.setItem('todos', JSON.stringify(todos))
}

// Функція для завантаження завдань з localStorage
function loadTodos() {
	const todos = JSON.parse(localStorage.getItem('todos') || '[]')
	todos.forEach(todo => {
		const todoElement = document.createElement('li')
		todoElement.classList.add('todo-item')
		if (todo.checked) {
			todoElement.classList.add('checked')
		}

		const textContainer = document.createElement('div')
		textContainer.classList.add('todo-text-container')

		const textElement = document.createElement('span')
		textElement.classList.add('todo-text')
		textElement.textContent = todo.text

		const timeElement = document.createElement('span')
		timeElement.classList.add('todo-time')
		timeElement.textContent = todo.time

		textContainer.appendChild(textElement)
		textContainer.appendChild(timeElement)

		if (todo.edited) {
			const editedElement = document.createElement('div')
			editedElement.classList.add('edited')
			editedElement.textContent = 'Редаговано!'
			textContainer.appendChild(editedElement)
		}

		const buttonContainer = document.createElement('div')
		buttonContainer.classList.add('button-container')

		const editBtn = document.createElement('button')
		editBtn.classList.add('edit-btn')
		editBtn.textContent = 'Edit'

		const deleteBtn = document.createElement('button')
		deleteBtn.classList.add('delete-btn')

		const deleteIcon = document.createElement('img')
		deleteIcon.src = icon
		deleteIcon.alt = 'Delete'
		deleteBtn.appendChild(deleteIcon)

		buttonContainer.appendChild(editBtn)
		buttonContainer.appendChild(deleteBtn)

		todoElement.appendChild(textContainer)
		todoElement.appendChild(buttonContainer)

		todoList.appendChild(todoElement)
	})
}

// Завантажити завдання при завантаженні сторінки
loadTodos()

button.addEventListener('click', () => {
	if (input.value) {
		if (editingTodo) {
			// Якщо редагується існуюче завдання
			const textElement = editingTodo.querySelector('.todo-text')
			textElement.textContent = input.value

			const timeElement = editingTodo.querySelector('.todo-time')
			const now = new Date()
			const hours = now.getHours().toString().padStart(2, '0')
			const minutes = now.getMinutes().toString().padStart(2, '0')
			timeElement.textContent = `${hours}:${minutes}`

			let editedElement = editingTodo.querySelector('.edited')
			if (!editedElement) {
				editedElement = document.createElement('div')
				editedElement.classList.add('edited')
				editedElement.textContent = 'Редаговано!'
				editingTodo
					.querySelector('.todo-text-container')
					.appendChild(editedElement)
			}

			editingTodo = null
			button.textContent = 'Add'
		} else {
			// Додавання нового завдання
			const todo = document.createElement('li')
			todo.classList.add('todo-item')

			const textContainer = document.createElement('div')
			textContainer.classList.add('todo-text-container')

			const textElement = document.createElement('span')
			textElement.classList.add('todo-text')
			textElement.textContent = input.value

			const timeElement = document.createElement('span')
			timeElement.classList.add('todo-time')
			const now = new Date()
			const hours = now.getHours().toString().padStart(2, '0')
			const minutes = now.getMinutes().toString().padStart(2, '0')
			timeElement.textContent = `${hours}:${minutes}`

			textContainer.appendChild(textElement)
			textContainer.appendChild(timeElement)

			const buttonContainer = document.createElement('div')
			buttonContainer.classList.add('button-container')

			const editBtn = document.createElement('button')
			editBtn.classList.add('edit-btn')
			editBtn.textContent = 'Edit'

			const deleteBtn = document.createElement('button')
			deleteBtn.classList.add('delete-btn')

			const deleteIcon = document.createElement('img')
			deleteIcon.src = icon
			deleteIcon.alt = 'Delete'
			deleteBtn.appendChild(deleteIcon)

			buttonContainer.appendChild(editBtn)
			buttonContainer.appendChild(deleteBtn)

			todo.appendChild(textContainer)
			todo.appendChild(buttonContainer)

			todoList.appendChild(todo)
		}

		input.value = ''
		saveTodos()
	}
})

todoList.addEventListener('click', event => {
	if (event.target.classList.contains('todo-item')) {
		event.target.classList.toggle('checked')
		saveTodos()
	} else if (
		event.target.classList.contains('delete-btn') ||
		event.target.tagName === 'IMG'
	) {
		event.target.closest('li').remove()
		saveTodos()
	} else if (event.target.classList.contains('edit-btn')) {
		const todoItem = event.target.closest('li')
		const textElement = todoItem.querySelector('.todo-text')
		input.value = textElement.textContent
		editingTodo = todoItem
		button.textContent = 'Update'
	}
})
