"use strict";
let Scene = function(gl) {

  // Enable Depth Test
  gl.enable(gl.DEPTH_TEST);

  // Normal Colors
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);

  // 3D
  // this.vsTextured3D = new Shader(gl, gl.VERTEX_SHADER, "textured_vs3D.essl");
  // this.fsTextured3D = new Shader(gl, gl.FRAGMENT_SHADER, "textured_fs3D.essl");
  this.shiny_vs = new Shader(gl, gl.VERTEX_SHADER, "shiny_vs.essl");
  this.shiny_fs = new Shader(gl, gl.FRAGMENT_SHADER, "shiny_fs.essl");
  this.texturedProgram3D = new TexturedProgram(gl, this.shiny_vs, this.shiny_fs);
  this.texture2DShiny = new Texture2D(gl, "img/envmaps/probe2017fall1.png");
  // this.texture2DEye = new Texture2D(gl, "img/YadonEyeDh.png");
  // this.texture2DBody = new Texture2D(gl, "img/YadonDh.png");

  this.materials3D = [new Material(gl, this.texturedProgram3D), new Material(gl, this.texturedProgram3D)];
  this.materials3D[0].probeTexture.set(this.texture2DShiny);
  this.materials3D[1].probeTexture.set(this.texture2DShiny);

  this.multiMesh = new MultiMesh(gl, "img/Slowpoke.json", this.materials3D);
  this.slowPoke1 = new GameObject(this.multiMesh);
  this.slowPoke1.position.set(new Vec3(-6, -1, -17));
  this.slowPoke2 = new GameObject(this.multiMesh);
  this.slowPoke2.position.set(new Vec3(6, -1, -17));

  // Time
  this.timeAtLastFrame = new Date().getTime();

  // Light
  Material.lightDirection.set(new Vec3(.5, 0, 0));
  // this.lightSources = []
  
  // Camera
  this.camera = new PerspectiveCamera();

  this.gameObjects = [];
  this.gameObjects.push(this.slowPoke1);
  this.gameObjects.push(this.slowPoke2);
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

  this.camera.move(dt, keysPressed);

  this.gameObjects.forEach( function(gameObject) {
    gameObject.draw(theScene.camera);
  });
};


