"use strict";
let Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.triangleGeometry = new TriangleGeometry(gl);
  this.squareGeometry = new SquareGeometry(gl);
  this.starGeometry = new StarGeometry(gl);
  this.heartGeometry = new HeartGeometry(gl);
  this.circleGeometry = new CircleGeometry(gl);

  this.timeAtLastFrame = new Date().getTime();

  // materials
  this.normalMaterial = new Material(gl, this.solidProgram);
  this.normalMaterial.time.set(0);
  this.heartMaterial = new Material(gl, this.solidProgram);
  this.heartMaterial.time.set(0);

  // constants
  this.SQUARE = "SQUARE";
  this.TRIANGLE = "TRIANGLE";
  this.HEART = "HEART";
  this.STAR = "STAR";
  this.CIRCLE = "CIRCLE";

  // rotate the square
  this.squareRotateChange = .03;

  
  // Camera
  this.camera = new OrthoCamera();

  // Camera Shaking
  this.shakeBool = true;


  // board setup
  this.boardSize = 10;
  this.gameObjects = [];
  this.createBoard(this.boardSize);
  this.drawBoard(this.boardSize);

};

// creates 1D array of size boardSize*boarSize
Scene.prototype.createBoard = function(boardSize) {
  for (var i = 0; i < boardSize; i++) {
    for (var j = 0; j < boardSize; j++) {
      this.gameObjects.push(this.generateRandomShape());
    }
  }
};

Scene.prototype.generateRandomShape = function() {
  switch(Math.floor(Math.random() * 5) + 1) {
    case 1:
    return new GameObject(new Mesh(this.triangleGeometry, this.normalMaterial), this.TRIANGLE);
    break;
    case 2:
    return new GameObject(new Mesh(this.squareGeometry, this.normalMaterial), this.SQUARE);
    break;
    case 3:
    return new GameObject(new Mesh(this.starGeometry, this.normalMaterial), this.STAR);
    break;
    case 4:
    return new GameObject(new Mesh(this.heartGeometry, this.heartMaterial), this.HEART);      
    break;
    case 5:
    return new GameObject(new Mesh(this.circleGeometry, this.normalMaterial), this.CIRCLE);      
    break;
  }
};

Scene.prototype.drawBoard = function(boardSize) {
  let boardWidth = 1.7;
  let offset = boardWidth/2 - .075;
  for (var i = 0.0; i < this.gameObjects.length; i+=boardSize) {
    for (var j = 0; j < boardSize; j++) {
      let dx = (boardWidth * (i / 100.0)) - offset;
      let dy = (boardWidth * (j / 10.00)) - offset; 
      if (this.gameObjects[i+j] != null) {
        this.gameObjects[i+j].position.set(new Vec2(dx, dy, 0));
      }
    }
  }
};


Scene.prototype.coordToIndex = function(canvasX, canvasY, canvas) {
  let retIndex = -1;
  this.gameObjects.forEach(function(gameObject, index) {
    let centerX = gameObject.position.storage[0];
    let centerY = gameObject.position.storage[1];


    if (canvasX < centerX + .09 && canvasX > centerX - .09) {
      if (canvasY < centerY + .09 && canvasY > centerY - .09) {
        retIndex = index;
      }
    }
  });

  return retIndex;
}

Scene.prototype.swap = function(index1, index2) {
  let temp = this.gameObjects[index2];
  this.gameObjects[index2] = this.gameObjects[index1];
  this.gameObjects[index1] = temp;
}

Scene.prototype.disappear = function(index) {
  this.gameObjects[index].disappear = true;
}

Scene.prototype.replace = function(index) {
  let oldPosition = this.gameObjects[index].oldPosition;

  this.gameObjects[index] = this.generateRandomShape();
  this.gameObjects[index].position = oldPosition;
}

Scene.prototype.stopQuake = function() {
  this.camera.rotate(0);
  this.camera.updateViewProjMatrix();
}




Scene.prototype.update = function(gl, keysPressed) {
  // velocity constant on all computers
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  // var diffVector = new Vec2(this.dx*dt, 0, 0);

  let theScene = this; // For using inside the closures

  // Pulse Heart
  this.heartMaterial.time.add(dt);

  // clear the screen
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  // QUAKE
  if (keysPressed["Q"]) {
    this.camera.rotate(Math.sin(timeAtThisFrame/80)/10);
      
    this.camera.updateViewProjMatrix();

    this.gameObjects.forEach( function(gameObject, index) {
      if ( (Math.floor(Math.random() * 1000)) == 1) {
        theScene.disappear(index);
      }
    });
  }


  // TURN THE TABLES
  if (keysPressed["A"]) {
    this.camera.stableRotation -= Math.PI/2;
    this.camera.rotate(0);
    this.camera.updateViewProjMatrix();

    keysPressed["A"] = false;
  }

  if (keysPressed["D"]) {
    this.camera.stableRotation += Math.PI/2;
    this.camera.rotate(0);
    this.camera.updateViewProjMatrix();

    keysPressed["D"] = false;
  }


  this.gameObjects.forEach( function(gameObject, index) {
    
    // Rotate Square
    if(gameObject.type === theScene.SQUARE) {
      gameObject.rotate(theScene.squareRotateChange);
    }

    // DRAMATIC EXIT
    if (gameObject.disappear == true) {
      gameObject.rotate(theScene.squareRotateChange);
      let oldScale = gameObject.scale;
      gameObject.scale = oldScale.add(new Vec3(-.01, -.01, 0));
    }
    if (gameObject.scale.x <= .05) {
      gameObject.replace = true;
    }
    if (gameObject.replace == true && gameObject.disappear == true) {
      theScene.replace(index);
      // console.log(theScene.coordToIndex(gameObject.position.x), theScene.coordToIndex(gameObject.position.y), gameObject.type);
    }


    gameObject.draw(theScene.camera);
  });
};


