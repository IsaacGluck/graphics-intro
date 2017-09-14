"use strict";
let Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.triangleGeometry = new TriangleGeometry(gl);
  // this.triangleGeometry2 = new TriangleGeometry(gl); // triangle 2

  this.timeAtLastFrame = new Date().getTime();

  // this.trianglePosition = {x:1, y:0, z:0}; // Added for motion

  this.trianglePosition = new Vec3(0, 0, 0); // Added for WebGLMath



  // this.t1x = 1;
  // this.t2x = 1;
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  
  // velocity constant on all computers
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  

  // Added for WebGLMath
  var dx = (0.5 * dt);
  var diffVector = new Vec2(dx, 0, 0);
  this.trianglePosition.add(diffVector);
  if (this.trianglePosition.x > 2)
    this.trianglePosition.x = -2;


  // this.trianglePosition.x = this.t1x - (0.2 * dt); // Added for motion
  // if (this.trianglePosition.x < -1)
  //   this.trianglePosition.x = 2;
  // this.t1x = this.trianglePosition.x;


  this.solidProgram.commit();

  // // Added for motion
  var trianglePositionLocation = gl.getUniformLocation(this.solidProgram.glProgram, "trianglePosition");
  if(trianglePositionLocation < 0)
  console.log("Could not find uniform trianglePosition.");
  else
    this.trianglePosition.commit(gl, trianglePositionLocation);
    // gl.uniform3f(trianglePositionLocation, this.trianglePosition.x, this.trianglePosition.y, this.trianglePosition.z);
  // // ~~~~~~~~~~

  this.triangleGeometry.draw();




  // // Trianlge 2


  // // Scale
  // // this.trianglePosition.x *= this.scale2;
  // // this.t2x = this.trianglePosition.x;
  // // this.trianglePosition.y *= this.scale2;
  // // this.trianglePosition.z *= this.scale2;


  // this.trianglePosition.x = this.t2x + (0.2 * dt); // Added for motion
  // if (this.trianglePosition.x > 2)
  // this.trianglePosition.x = -1;
  // this.t2x = this.trianglePosition.x;

  // if(trianglePositionLocation < 0)
  // console.log("Could not find uniform trianglePosition.");
  // else
  // gl.uniform3f(trianglePositionLocation, this.trianglePosition.x, this.trianglePosition.y, this.trianglePosition.z);

  // this.triangleGeometry.draw();

  // this.trianglePosition.x = this.t1x;

  // // Unscale
  // // this.trianglePosition.x /= this.scale2;
  // // this.trianglePosition.y /= this.scale2;
  // // this.trianglePosition.z /= this.scale2;

};


