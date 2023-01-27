
// Variables globales
let area;
let cube;
let acctions = [];
let deleted;

let size = 50;

let position = document.getElementById("position");

let color = { r: 255, g: 0, b: 0 };
let coordinates = { x: 0, y: 0 };

let cubes = new Map();
let cubesDel = [];
deleted = document.getElementById("deleted");

// Área para el proyecto
let main = document.getElementsByTagName("main")[0];
area = document.createElement("div");
area.classList.add("container");
main.parentElement.insertBefore(area, main);


// Pieza que queremos mover
cube = document.createElement("div");
cube.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
cube.classList.add("cube");
area.appendChild(cube);


// Evento de pulsado de tecla.
document.addEventListener("keydown", function (event) {
	console.log(event.code);
	switch (event.code) { // Detección de tecla pulsada.
		case "ArrowUp":
			addAction("up");
			break;
		case "ArrowDown":
			addAction("down");
			break;
		case "ArrowLeft":
			addAction("left");
			break;
		case "ArrowRight":
			addAction("right");
			break;
		case "KeyC":
			addAction("color");
			break;
		case "NumpadAdd":
			addAction("+");
			break;
		case "NumpadSubtract":
			addAction("-");
			break;
		case "Enter":
			executeAcctions();
			break;
		default:
			break;
	}
	event.preventDefault();
});

// Funciones de implementación de acciones
function moveUp(cube) {
	let top = cube.offsetTop;
	top -= 10;
	top = (top < 0) ? 0 : top;
	cube.style.top = top + "px";
}

function moveDown(cube) {
	let top = cube.offsetTop;
	top += 10;
	top = (top > area.offsetHeight - cube.offsetHeight) ? area.offsetHeight - cube.offsetHeight : top;
	cube.style.top = top + "px";
}

function moveLeft(cube) {
	let left = cube.offsetLeft;
	left -= 10;
	left = (left < 0) ? 0 : left;
	cube.style.left = left + "px";
}

function moveRight(cube) {
	let left = cube.offsetLeft;
	left += 10;
	left = (left > area.offsetWidth - cube.offsetWidth) ? area.offsetWidth - cube.offsetWidth : left;
	cube.style.left = left + "px";
}

function randomColor(cube) {
	color.r = Math.floor((Math.random() * 256));
	color.g = Math.floor((Math.random() * 256));
	color.b = Math.floor((Math.random() * 256));
	cube.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
}

// Registro de acción y generación de span
function addAction(action) {
	let span = document.createElement("span");
	acctions.push({
		action: action,
		span: span
	});
	span.textContent = action;
	//Los estilos del span estan en la css
	span.addEventListener("mouseenter", function () {
		this.style.backgroundColor = "red";
		this.style.color = "white";
	})
	span.addEventListener("mouseleave", function () {
		this.style.backgroundColor = "white";
		this.style.color = "black";
	})
	span.addEventListener("click", function (event) {
		let index = acctions.findIndex((action) => {
			return action.span === this;
		})
		acctions.splice(index, 1);
		this.remove();
		event.stopPropagation()
	})
	area.appendChild(span);
}

// Ejecución de acciones recursiva
function executeAcctions() {
	if (acctions.length > 0) {
		let action = acctions.shift();
		switch (action.action) {
			case "up":
				moveUp(cube);
				break;
			case "down":
				moveDown(cube);
				break;
			case "left":
				moveLeft(cube);
				break;
			case "right":
				moveRight(cube);
				break;
			case "color":
				randomColor(cube);
				break;
			case "+":
				addSize();
				break;
			case "-":
				subtractSize();
				break;
			default:
				break;
		}
		action.span.remove();
		setTimeout(executeAcctions, 50);
	}
}

area.addEventListener("mousemove", (event) => {
	/*
		Si uso event.offset cuando me muevo y estoy en un cube
		se activa el evento y me pone el offset en función a ese cubo,
		para poder eliminar este problema he tenido que usar la función
		getBoundingClientRect
		Me devuelve los datos de las posiciones del cuadrado de area, su ancho y su alto
		x: 8, y: 8, width: 925, height: 404, top: 8, right: 933, bottom: 412, left: 8 }

		después he tomado la posición de las coordenas con event.client y le resto la separación en top y left
		coordinates.x = event.offsetX; --> coordinates.x = event.clientX - rect.left;
		coordinates.y = event.offsetY; --> coordinates.y = event.clientY - rect.top;
	*/

	let rect = area.getBoundingClientRect();
	coordinates.x = event.clientX - rect.left;
	coordinates.y = event.clientY - rect.top;

	this.position.innerHTML = `X: ${coordinates.x} Y: ${coordinates.y}`;

});

//Reseteamos las posiciones
area.addEventListener("mouseleave", (event) => {
	this.position.innerHTML = `X: 0 Y: 0`;
});

function addSize() {
	//No podemos superar la altura de la caja ni sobrepasar el borde lateral
	if (size < 400 - cube.offsetTop && size + 5 < area.clientWidth - cube.offsetLeft) {
		size += 5;
		cube.style.width = `${size}px`;
		cube.style.height = `${size}px`;
	} else if (cube.offsetTop > 0 && size + 5 < area.clientWidth - cube.offsetLeft) {
		size += 5;
		cube.style.width = `${size}px`;
		cube.style.height = `${size}px`;
		cube.style.top = `${cube.offsetTop - 5}px`;
	}

}
function subtractSize() {
	if (size - 5 >= 10) {
		size -= 5;
		cube.style.width = `${size}px`;
		cube.style.height = `${size}px`;
	}
}
let count = 0;

let removeCubesEvent = new CustomEvent("removeCubes", {
	bubbles: true,
	detail: {
		index: 0
	}
});

area.addEventListener("click", (event) => {
	//Solo se activa en area, si hago click en el primer cuadrado que no se puede eliminar no hace nada
	if (event.target == event.currentTarget) {
		let cube = document.createElement("div");
		let span = document.createElement("span");
		let index = ++count;

		//propiedades del cubo
		cube.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
		cube.classList.add("cubeCursor", "cube");
		cube.style.top = `${coordinates.y}px`;
		cube.style.left = `${coordinates.x}px`;
		//propiedades del span
		span.classList.add("indexCube");
		span.textContent = index;

		//aumentamos el mapa de cubes
		cubes.set(index, { cube: cube, span: span });

		//añadimos el evento para hacer click y eliminarlo
		cube.addEventListener("click", function (event) {
			//lanzamos el evento personalizado
			let pos = parseInt(cube.textContent)
			removeCubesEvent.detail.index = pos;
			area.dispatchEvent(removeCubesEvent);

			event.stopPropagation()

		})

		//añadimos a area y a cube
		area.appendChild(cube);
		cube.appendChild(span);
	}
})


area.addEventListener("removeCubes", function (event) {
	let index = event.detail.index
	let cube = cubes.get(index);
	cubesDel.push(cube);
	cube.cube.classList.remove("cubeCursor", "cube");
	let color = cube.cube.style.background;

	cube.cube.removeAttribute("style");
	cube.cube.classList.add("cubeDel");

	cube.cube.style.background = color;

	cubes.delete(index);
	cubesDel.sort((a, b) => { return parseInt(a.cube.textContent) - parseInt(b.cube.textContent) })

	newPos = searchCube(cube.cube);

	if (cubesDel.length - 1 == newPos) {
		deleted.appendChild(cubesDel[cubesDel.length - 1].cube);
	}
	else {
		deleted.insertBefore(cubesDel[newPos].cube, cubesDel[newPos + 1].cube);
	}

})

function searchCube(cube) {
	return cubesDel.findIndex((cub) => cub.cube.textContent == cube.textContent);
}
