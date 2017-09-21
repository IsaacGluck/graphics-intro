"use strict";
let Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.triangleGeometry = new TriangleGeometry(gl);

  this.timeAtLastFrame = new Date().getTime();

  this.trianglePosition = new Vec3(0, 0, 0);

  this.material = new Material(gl, this.solidProgram);
  this.material.solidColor.set(1, 1, 1);


  this.dx = 1;
  this.scaleVector = new Vec2(1, 1, 0);
  this.scaleChange = .05;
  this.rotateVal = 0;
  this.rotateChange = .05;
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


  // Added for WebGLMath
  if (keysPressed["RIGHT"]) {
    var diffVector = new Vec2(this.dx*dt, 0, 0);
    this.trianglePosition.add(diffVector);

    if (this.trianglePosition.x > 2)
      this.trianglePosition.x = -2;
  }

  if (keysPressed["LEFT"]) {
    var diffVector = new Vec2(this.dx*dt*-1, 0, 0);
    this.trianglePosition.add(diffVector);

    if (this.trianglePosition.x < -2)
    this.trianglePosition.x = 2;
  }

  if (keysPressed["UP"]) {
    var diffVector = new Vec2(0, this.dx*dt, 0);
    this.trianglePosition.add(diffVector);

    if (this.trianglePosition.y > 2)
    this.trianglePosition.y = -2;
  }

  if (keysPressed["DOWN"]) {
    var diffVector = new Vec2(0, this.dx*dt*-1, 0);
    this.trianglePosition.add(diffVector);

    if (this.trianglePosition.y < -2)
    this.trianglePosition.y = 2;
  }

  if (keysPressed["S"]) {
    this.scaleVector.add(new Vec2(this.scaleChange, this.scaleChange, 0));
  }

  if (keysPressed["U"]) {
    this.scaleVector.add(new Vec2(-this.scaleChange, -this.scaleChange, 0));
  }


  // this.rotateVal += .1; // Continuous
  if (keysPressed["R"]) {
    this.rotateVal += this.rotateChange;
  }

  if (keysPressed["T"]) {
    this.rotateVal -= this.rotateChange;
  }


  this.material.modelMatrix.set().rotate(this.rotateVal).scale(this.scaleVector).translate(this.trianglePosition);
  this.material.commit();
  this.triangleGeometry.draw();

  this.material.modelMatrix.set().rotate(this.rotateVal).scale(this.scaleVector).translate(this.trianglePosition.times(-1));
  this.material.commit();
  this.triangleGeometry.draw();

};


