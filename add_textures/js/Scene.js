"use strict";
let Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new TexturedProgram(gl, this.vsIdle, this.fsSolid);
  this.triangleGeometry = new TriangleGeometry(gl);

  this.timeAtLastFrame = new Date().getTime();

  this.material = new Material(gl, this.solidProgram);
  this.material.solidColor.set(1, 1, 1);


  this.dx = 1;
  this.scaleVector = new Vec2(1, 1, 0);
  this.scaleChange = .05;
  this.rotateVal = 0;
  this.rotateChange = .05;


  this.mode = 0;
  
  // Camera
  this.camera = new OrthoCamera();

  this.gameObjects = [];
  this.gameObjects.push(new GameObject(new Mesh(this.triangleGeometry, this.material)));
  this.gameObjects.push(new GameObject(new Mesh(this.triangleGeometry, this.material)));
  this.gameObjects.push(new GameObject(new Mesh(this.triangleGeometry, this.material)));
  this.gameObjects.push(new GameObject(new Mesh(this.triangleGeometry, this.material)));

  this.gameObjects.forEach( function(gameObject, index) {  
    gameObject.mode = index;
  });
  // console.log(this.gameObjects);

};

Scene.prototype.update = function(gl, keysPressed) {
  
  // velocity constant on all computers
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let theScene = this;
  ["0", "1", "2", "3"].forEach( function(element, index){
    if (keysPressed[element])
      theScene.mode = index;

  });

  // Added for WebGLMath
  if (keysPressed["RIGHT"]) {
    var diffVector = new Vec2(this.dx*dt, 0, 0);
    // this.gameObjects[0].position.add(diffVector);
    let theScene = this;
    this.gameObjects.forEach( function(element) {
      if (element.mode == theScene.mode) {
        element.position.add(diffVector);
      }
    });
  }

  if (keysPressed["LEFT"]) {
    var diffVector = new Vec2(this.dx*dt*-1, 0, 0);
    // this.gameObjects[0].position.add(diffVector);
    let theScene = this;
    this.gameObjects.forEach( function(element) {
      if (element.mode == theScene.mode) {
        element.position.add(diffVector);
      }
    });
  }

  if (keysPressed["UP"]) {
    var diffVector = new Vec2(0, this.dx*dt, 0);
    // this.gameObjects[0].position.add(diffVector);
    let theScene = this;
    this.gameObjects.forEach( function(element) {
      if (element.mode == theScene.mode) {
        element.position.add(diffVector);
      }
    });
  }

  if (keysPressed["DOWN"]) {
    var diffVector = new Vec2(0, this.dx*dt*-1, 0);
    // this.gameObjects[0].position.add(diffVector);
    let theScene = this;
    this.gameObjects.forEach( function(element) {
      if (element.mode == theScene.mode) {
        element.position.add(diffVector);
      }
    });
  }

  if (keysPressed["S"]) {
    this.scaleVector.add(new Vec2(this.scaleChange, this.scaleChange, 0));
    this.gameObjects[0].scale.set(this.scaleVector);
  }

  if (keysPressed["U"]) {
    this.scaleVector.add(new Vec2(-this.scaleChange, -this.scaleChange, 0));
    this.gameObjects[0].scale.set(this.scaleVector);
  }

  if (keysPressed["R"]) {
    this.rotateVal += this.rotateChange;
    this.gameObjects[0].orientation = this.rotateVal;
  }

  if (keysPressed["T"]) {
    this.rotateVal -= this.rotateChange;
    this.gameObjects[0].orientation = this.rotateVal;
  }

  this.gameObjects.forEach( function(gameObject) {
    gameObject.draw(theScene.camera);
  });
};


