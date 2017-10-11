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

Scene.prototype.generateSpecificShape = function(type) {
  switch(type) {
    case this.TRIANGLE:
    return new GameObject(new Mesh(this.triangleGeometry, this.normalMaterial), this.TRIANGLE);
    break;
    case this.SQUARE:
    return new GameObject(new Mesh(this.squareGeometry, this.normalMaterial), this.SQUARE);
    break;
    case this.STAR:
    return new GameObject(new Mesh(this.starGeometry, this.normalMaterial), this.STAR);
    break;
    case this.HEART:
    return new GameObject(new Mesh(this.heartGeometry, this.heartMaterial), this.HEART);      
    break;
    case this.CIRCLE:
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
};

Scene.prototype.swap = function(index1, index2) {
  let temp = this.gameObjects[index2];
  this.gameObjects[index2] = this.gameObjects[index1];
  this.gameObjects[index1] = temp;
};

Scene.prototype.disappear = function(index) { this.gameObjects[index].disappear = true; };

Scene.prototype.replace = function(index) {
  let newIndex = Math.floor(index/10) * 10 + 9;
  let oldPosition = this.gameObjects[newIndex].oldPosition;

  let columnAbove = this.columnAbove(index);
  // console.log("index: " + index, columnAbove);
  for (var i = 0; i < columnAbove.length; i++) {
    this.downOne(columnAbove[i]);
  }

  this.gameObjects[newIndex] = this.generateRandomShape();
  this.gameObjects[newIndex].position = oldPosition;
  this.gameObjects[newIndex].oldPosition = oldPosition;


};

Scene.prototype.downOne = function(index) {
  let newIndex = index - 1;
  let temp = this.generateSpecificShape(this.gameObjects[index].type);
  temp.position = this.gameObjects[newIndex].position;
  temp.oldPosition = this.gameObjects[newIndex].position;

  // temp.movingDown = true;
  // temp.movingDownGoal = this.gameObjects[newIndex].position;
  // temp.position = this.gameObjects[index].position;

  this.gameObjects[newIndex] = temp;
  // console.log(temp);
}

Scene.prototype.stopQuake = function() {
  this.camera.rotate(0);
  this.camera.updateViewProjMatrix();
};

Scene.prototype.threeInRow = function(index) {
  let retObject = {
    anyToDelete: false,
    indicesToDelete: [],
  };

  let rightLeft = [];
  let upDown = [];

  if (index < 0 || index > 99) {
    return retObject;
  }

  let currentType = this.gameObjects[index].type;

  // right
  let checkIndex = index + 10;
  while (checkIndex <= 99) {
    if (this.gameObjects[checkIndex].type == currentType) {
      rightLeft.push(checkIndex);
      checkIndex += 10;
    } else {
      break;
    }
  }

  // left
  checkIndex = index - 10;
  while (checkIndex >= 0) {
    if (this.gameObjects[checkIndex].type == currentType) {
      rightLeft.push(checkIndex);
      checkIndex -= 10;
    } else {
      break;
    }
  }

  if (rightLeft.length >= 2) {
    retObject.anyToDelete = true;
  } else {
    rightLeft = [];
  }

  // up
  checkIndex = index + 1;
  while (Math.floor(checkIndex/10) == Math.floor(index/10) && checkIndex <= 99) {
    if (this.gameObjects[checkIndex].type == currentType) {
      upDown.push(checkIndex);
      checkIndex++;
    } else {
      break;
    }
  }

  // down
  checkIndex = index - 1;
  while (Math.floor(checkIndex/10) == Math.floor(index/10) && checkIndex >= 0) {
    if (this.gameObjects[checkIndex].type == currentType) {
      upDown.push(checkIndex);
      checkIndex--;
    } else {
      break;
    }
  }

  if (upDown.length >= 2) {
    retObject.anyToDelete = true;
  } else {
    upDown = [];
  }

  retObject.indicesToDelete = rightLeft.concat(upDown);

  if (retObject.anyToDelete) {
    retObject.indicesToDelete.push(index);
  }

  return retObject;
}

Scene.prototype.columnAbove = function(index) {
  let retArray = [];

  let checkIndex = index + 1;
  while (Math.floor(checkIndex/10) == Math.floor(index/10) && checkIndex <= 99) {
    retArray.push(checkIndex);
    checkIndex++;
  }

  return retArray;
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
    // Rotate Square GYRO
    if(gameObject.type === theScene.SQUARE) {
      gameObject.rotate(theScene.squareRotateChange);
    }

    // THREE IN A ROW
    if (gameObject.disappear != true) {
      let threeInRow = theScene.threeInRow(index);
      if (threeInRow.anyToDelete) {
        for (var i = 0; i < threeInRow.indicesToDelete.length; i++) {
          theScene.disappear(threeInRow.indicesToDelete[i]);
        }
      }
    }
    

    // DRAMATIC EXIT
    if (gameObject.disappear == true) {
      gameObject.rotate(theScene.squareRotateChange + .02);
      let oldScale = gameObject.scale;
      gameObject.scale = oldScale.add(new Vec3(-.01, -.01, 0));
    }
    if (gameObject.scale.x <= .05) {
      gameObject.replace = true;
    }
    if (gameObject.replace == true && gameObject.disappear == true) {
      theScene.replace(index);
    }

    gameObject.draw(theScene.camera);
  });
};


