"use strict";
let Scene = function(gl) {

  // Enable Depth Test
  gl.enable(gl.DEPTH_TEST);

  // Shiny
  this.shiny_vs = new Shader(gl, gl.VERTEX_SHADER, "shiny_vs.essl");
  this.shiny_fs = new Shader(gl, gl.FRAGMENT_SHADER, "shiny_fs.essl");
  this.texturedProgram3D = new TexturedProgram(gl, this.shiny_vs, this.shiny_fs);
  this.texture2DShiny = new Texture2D(gl, "img/envmaps/probe2017fall1.png");
  this.materials3D = [new Material(gl, this.texturedProgram3D), new Material(gl, this.texturedProgram3D)];
  this.materials3D[0].probeTexture.set(this.texture2DShiny);
  this.materials3D[1].probeTexture.set(this.texture2DShiny);
  this.multiMesh = new MultiMesh(gl, "img/Slowpoke.json", this.materials3D);
  this.slowPoke1 = new GameObject(this.multiMesh);
  this.slowPoke1.position.set(new Vec3(-6, -1, -17));
  this.slowPoke2 = new GameObject(this.multiMesh);
  this.slowPoke2.position.set(new Vec3(6, -1, -17));


  this.envQuad_vs = new Shader(gl, gl.VERTEX_SHADER, "envQuad_vs.essl");
  this.envQuad_fs = new Shader(gl, gl.FRAGMENT_SHADER, "envQuad_fs.essl");
  this.envProgram = new Program(gl, this.envQuad_vs, this.envQuad_fs);
  this.materialEnv = new Material(gl, this.envProgram);
  this.materialEnv.probeTexture.set(this.texture2DShiny);
  this.meshEnv = new Mesh(new SquareGeometry(gl), this.materialEnv);
  this.envQuad = new GameObject(this.meshEnv);

  // Time
  this.timeAtLastFrame = new Date().getTime();

  // Light
  this.directionalLight = new Vec4(.5, 1, 0, 0);
  // this.pointLight = new Vec4(this.chevyAvatar.position.clone()
  //                             .addScaled(45, this.chevyAvatar.ahead)
  //                             .addScaled(8, this.chevyAvatar.up), 1);
  this.directionalLightPowerDensity = new Vec3(1, 1, 1);
  // this.pointLightPowerDensity = new Vec3(2000, 2000, 200);


  this.lightSources = [this.directionalLight, this.pointLight];
  this.lightPowerDensities = [this.directionalLightPowerDensity,
                              this.pointLightPowerDensity];

  Material.lightPos.at(0).set(this.lightSources[0]);
  // Material.lightPos.at(1).set(this.lightSources[1]);

  Material.lightPowerDensity.at(0).set(this.lightPowerDensities[0]);
  // Material.lightPowerDensity.at(1).set(this.lightPowerDensities[1]);

  Material.spotDir.at(0).set(new Vec3(.5, 1, 0));
  // Material.spotDir.at(1).set(this.chevyAvatar.ahead.clone());

  this.quadricsArray = [];
  ClippedQuadric king = new ClippedQuadric();


  // QUADRICS
  //shape
  Material.quadrics.at(0).set(
      1, 0, 0, 0,
      0, -1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 0);
  //clipper
  Material.quadrics.at(1).set(
      0, 0, 0, 0,
      0, 1, 0, 1,
      0, 0, 0, 0,
      0, 0, 0, 0);
  //material
  Material.brdfs.at(0).set(1, 1, 1, 0); 

   //shape
  // Material.quadrics.at(2).set(
  //     1, 0, 0, 0,
  //     0, 1, 0, 0,
  //     0, 0, 1, 0,
  //     0, 0, 0, -1).scale(1, 0, 1);
  // //clipper
  // Material.quadrics.at(3).set(
  //     1, 0, 0, 0,
  //     0, 1, 0, 0,
  //     0, 0, 1, 0,
  //     0, 0, 0, -1).scale(1, 1, 0);
  // //material
  // Material.brdfs.at(1).set(1, 1, 1, 0); 

  
  // Camera
  this.camera = new PerspectiveCamera();

  this.gameObjects = [];
  // this.gameObjects.push(this.slowPoke1);
  // this.gameObjects.push(this.slowPoke2);
  this.gameObjects.push(this.envQuad);
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


