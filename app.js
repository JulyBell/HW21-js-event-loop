let textInput = document.querySelector('#textInput'); //поле инпута
let button = document.querySelector('#textBtn');	//кнопка
let toDoList = document.getElementById('toDoList');	//поле отображения списка
let li = document.createElement('li');

button.addEventListener('click', addPoint); //обработчик кнопки

async function getTodos(){
 	let todosArray = await fetch('http://localhost:3000/todos');
	let todos = await todosArray.json();
	toDoList.innerHTML = todos.map((item) => {
		li = `<span><li id = ${item.id} data-status = ${item.completed} class = "notDone"> ${item.title}</li><button id = ${item.id} class = "deleteButton">X</button></span>`;
		return li;
	}).join('');  
}

getTodos();

function createTodo(post){
	async function addtodo(){
		let link = await fetch('http://localhost:3000/todos', {
		method: 'POST', 
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(post)
		});
	
		let response = await link.json();
		li = response.title;
		
		console.log(response.title, 'show');
		getTodos();
	}

	addtodo();	
}

function changeStatus(id, post){
	async function changeTodo(){
		let totalLink = 'http://localhost:3000/todos/' + id;
		let link = await fetch(totalLink, {
		method: 'PUT', 
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(post)
		});
	
		let response = await link.json();
		console.log(response, 'show');

	}

	changeTodo();	
}

function addPoint(e){
	e.preventDefault();
	
	let inputedPoint = textInput.value; //значение в инпуте
	let post = {
		"title": inputedPoint,
		"completed": false
	}

	createTodo(post);
	textInput.value = ''; //очищаем инпут
}

function deleteItem(id){
	
		let totalLink = 'http://localhost:3000/todos/' + id;
		fetch(totalLink, {
			method: 'DELETE'
		})
		.then(res => res.json())
		.then(res => console.log(res))
		.catch(err => console.log(err));

		getTodos();
}

toDoList.addEventListener('click', (e) => {
	e.preventDefault();


	if(e.target.tagName === 'LI'){
		let targetId = e.target.id;
		let elem = document.getElementById(targetId);
		let statusString = elem.getAttribute('data-status');
		newStatus = (statusString.toLowerCase() === 'true'); //преобразуем из "булевой" строки в булево значение
		newStatus = !newStatus;
		elem.setAttribute('data-status', newStatus);
		let title = elem.innerText;

		let changedTodo = {
			"title": title,
			"completed": newStatus
		}
		changeStatus(targetId, changedTodo);
		newStatus === true ? elem.className = 'done' : elem.className = 'notDone'; //меняем цвет фона
	}

	if(e.target.tagName === 'BUTTON'){
		let targetId = e.target.id;
		e.target.closest('span').remove();
		deleteItem(targetId);
	}
})