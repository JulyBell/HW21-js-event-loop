let textInput = document.querySelector('#textInput'); //поле инпута
let button = document.querySelector('#textBtn');	//кнопка
let toDoList = document.getElementById('toDoList');	//поле отображения списка
let li = document.createElement('li');

button.addEventListener('click', todoEvent); //обработчик кнопки

async function getTodos(){
 	let todosArray = await fetch('http://localhost:3000/todos');
	let todos = await todosArray.json();
	toDoList.innerHTML = todos.map((item) => {
		li = `<span><li id = ${item.id} data-id = ${item.id} data-status = ${item.completed} class = "notDone"> ${item.title}</li><button id = ${item.id} class = "deleteButton">X</button></span>`;
		return li;
	}).join('');  
}

getTodos();


async function addtodo(post){
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


async function changeTodo(id, post){
	let link = await fetch('http://localhost:3000/todos/' + id, {
	method: 'PUT', 
	headers: {
		'Content-Type': 'application/json;charset=utf-8'
	},
	body: JSON.stringify(post)
	});
	
	let response = await link.json();
	console.log(response, 'show');

}



function todoEvent(e){
	e.preventDefault();
	
	let inputedPoint = textInput.value; //значение в инпуте
	let post = {
		"title": inputedPoint,
		"completed": false
	}

	addtodo(post);
	textInput.value = ''; //очищаем инпут
}

function deleteItem(id){

		fetch('http://localhost:3000/todos/' + id, {
			method: 'DELETE'
		})
		.then(res => res.json())
		.then(res => console.log(res))
		.catch(err => console.log(err));

}

function liEvent(e){
	let elem = document.getElementById(e.target.id);
	let statusString = elem.getAttribute('data-status');
	let elemId = elem.getAttribute('data-id');
	newStatus = (statusString.toLowerCase() === 'true'); //преобразуем из "булевой" строки в булево значение
	newStatus = !newStatus;
	elem.setAttribute('data-status', newStatus);
	let title = elem.innerText;

	let changedTodo = {
		"title": title,
		"completed": newStatus
	}
	changeTodo(elemId, changedTodo);
	elem.className =  newStatus === true ? 'done' : 'notDone'; //меняем цвет фона
}

function buttonEvent(e){
	let targetId = e.target.id;
	e.target.closest('span').remove();
	deleteItem(targetId);
}

toDoList.addEventListener('click', (e) => {
	e.preventDefault();

	if(e.target.tagName === 'LI'){
		liEvent(e);
	}else if(e.target.tagName === 'BUTTON'){
		buttonEvent(e);
	}
})