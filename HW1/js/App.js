// App constructor
let App = function(canvas, overlay) {
	this.canvas = canvas;
	this.overlay = overlay;

	this.swapIndex = -1;
	this.swapOldX = null;
	this.swapOldY = null;

	// if no GL support, cry
	this.gl = canvas.getContext("experimental-webgl");
	if (this.gl === null) {
		throw new Error("Browser does not support WebGL");

	}

	this.gl.pendingResources = {};

	this.timeAtLastFrame = new Date().getTime(); // ADDED get the time 

	this.keysPressed = {};

	// create a simple scene
	this.scene = new Scene(this.gl);

	this.resize();
};

// match WebGL rendering resolution and viewport to the canvas size
App.prototype.resize = function() {
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

	this.scene.camera.setAspectRatio(
    this.canvas.clientWidth /
    this.canvas.clientHeight );
};

App.prototype.registerEventHandlers = function() {
	let theApp = this;

	document.onkeydown = function(event) {
		theApp.keysPressed[keyboardMap[event.keyCode]] = true;
	};

	document.onkeyup = function(event) {
		if (theApp.keysPressed["Q"]) {
			theApp.scene.stopQuake();
		}

		theApp.keysPressed[keyboardMap[event.keyCode]] = false;
	};

	this.canvas.onmousedown = function(event) {
		//jshint unused:false
		let startX =  2 * ((event.clientX / theApp.canvas.clientWidth)  - .5);
		let startY = -2 * ((event.clientY / theApp.canvas.clientHeight) - .5);

		let coordVec = new Vec4(startX, startY, 0, 1);
		coordVec = coordVec.mul(new Mat4 (theApp.scene.camera.viewProjMatrix).invert());

		startX = coordVec.x;
		startY = coordVec.y;

		let swapIndex = theApp.scene.coordToIndex(startX, startY, theApp.canvas);

		// console.log(theApp.scene.columnAbove(swapIndex));
		
		if (swapIndex >= 0) {
			theApp.swapIndex = swapIndex;
			theApp.swapOldX = theApp.scene.gameObjects[theApp.swapIndex].position.storage[0];
			theApp.swapOldY = theApp.scene.gameObjects[theApp.swapIndex].position.storage[1];


			if (theApp.keysPressed["B"]) {
      	theApp.scene.disappear(theApp.swapIndex);
    	}	
		}



	};

	this.canvas.onmousemove = function(event) {
		let updateX =  2 * ((event.clientX / theApp.canvas.clientWidth)  - .5);
		let updateY = -2 * ((event.clientY / theApp.canvas.clientHeight) - .5);

		let coordVec = new Vec4(updateX, updateY, 0, 1);
		coordVec = coordVec.mul(new Mat4 (theApp.scene.camera.viewProjMatrix).invert());

		updateX = coordVec.x;
		updateY = coordVec.y;

		if (theApp.swapIndex >= 0) {
			theApp.scene.gameObjects[theApp.swapIndex].position.storage[0] = updateX;
			theApp.scene.gameObjects[theApp.swapIndex].position.storage[1] = updateY;
		}

		event.stopPropagation();
	};
	this.canvas.onmouseout = function(event) {
		//jshint unused:false
	};

	this.canvas.onmouseup = function(event) {

		if (theApp.swapIndex >= 0) {
			theApp.scene.gameObjects[theApp.swapIndex].position.storage[0] = theApp.swapOldX;
			theApp.scene.gameObjects[theApp.swapIndex].position.storage[1] = theApp.swapOldY;				
		}

		let newX =  2 * ((event.clientX / theApp.canvas.clientWidth)  - .5);
		let newY = -2 * ((event.clientY / theApp.canvas.clientHeight) - .5);

		let coordVec = new Vec4(newX, newY, 0, 1);
		coordVec = coordVec.mul(new Mat4 (theApp.scene.camera.viewProjMatrix).invert());

		newX = coordVec.x;
		newY = coordVec.y;

		let newIndex = theApp.scene.coordToIndex(newX, newY, theApp.canvas);




		if (theApp.swapIndex >= 0 && newIndex >= 0) {
			theApp.scene.swap(theApp.swapIndex, newIndex);

			if (!theApp.scene.threeInRow(theApp.swapIndex).anyToDelete && !theApp.scene.threeInRow(newIndex).anyToDelete) {
				theApp.scene.swap(theApp.swapIndex, newIndex);
			}


			theApp.scene.drawBoard(theApp.scene.boardSize);

			theApp.swapIndex = -1;
		}
	};
	window.addEventListener('resize', function() {
		theApp.resize();
	});
	window.requestAnimationFrame(function() {
		theApp.update();
	});
};

// animation frame update
App.prototype.update = function() {

	let pendingResourceNames = Object.keys(this.gl.pendingResources);
	if (pendingResourceNames.length === 0) {
		// animate and draw scene
		this.scene.update(this.gl, this.keysPressed);
	} else {
		this.overlay.innerHTML = "Loading: " + pendingResourceNames;
	}

	// refresh
	let theApp = this;
	window.requestAnimationFrame(function() {
		theApp.update();
	});
};

// entry point from HTML
window.addEventListener('load', function() {
	let canvas = document.getElementById("canvas");
	let overlay = document.getElementById("overlay");

	let app = new App(canvas, overlay);
	app.registerEventHandlers();
});