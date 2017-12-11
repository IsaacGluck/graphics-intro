"use strict";
let Scene = function(gl) {

  // Shiny setup
  this.setup(gl);

  // Light
  this.lightInfo();

  // Board
  this.boardSetup();

  // Gold and Silver Uniforms
  this.makeGoldSilverUniforms();


  // Sphere 1
  this.sphere1 = new Quadric(new Mat4());
  this.sphere1.setUnitSphere();
  this.sphere1.transform(new Mat4().translate(-3, 2.1, 1));
  Material.quadrics.at(3).set(this.sphere1.surfaceCoeffMatrix);
  Material.brdfs.at(3).set(2, 2, 2, 2);

  // Sphere 1
  this.sphere2 = new Quadric(new Mat4());
  this.sphere2.setUnitSphere();
  this.sphere2.transform(new Mat4().translate(3, 2.1, 1));
  // Material.quadrics.at(4).set(this.sphere2.surfaceCoeffMatrix);
  // Material.brdfs.at(4).set(1, 1, 1, 1);

  
};

Scene.prototype.setup = function(gl) {
  // Enable Depth Test
  gl.enable(gl.DEPTH_TEST);

  this.shiny_vs = new Shader(gl, gl.VERTEX_SHADER, "shiny_vs.essl");
  this.shiny_fs = new Shader(gl, gl.FRAGMENT_SHADER, "shiny_fs.essl");
  this.texturedProgram3D = new TexturedProgram(gl, this.shiny_vs, this.shiny_fs);
  this.texture2DShiny = new Texture2D(gl, "img/envmaps/probe2017fall1.png");

  this.envQuad_vs = new Shader(gl, gl.VERTEX_SHADER, "envQuad_vs.essl");
  this.envQuad_fs = new Shader(gl, gl.FRAGMENT_SHADER, "envQuad_fs.essl");
  this.envProgram = new Program(gl, this.envQuad_vs, this.envQuad_fs);
  this.materialEnv = new Material(gl, this.envProgram);
  this.materialEnv.probeTexture.set(this.texture2DShiny);
  this.meshEnv = new Mesh(new SquareGeometry(gl), this.materialEnv);
  this.envQuad = new GameObject(this.meshEnv);

  // Time
  this.timeAtLastFrame = new Date().getTime();

  // Camera
  this.camera = new PerspectiveCamera();
  this.camera.position = new Vec3(0.0, 5.0, 15.0);

  this.gameObjects = [];
  this.gameObjects.push(this.envQuad);
};

Scene.prototype.lightInfo = function() {
  this.directionalLight = new Vec4(1, 1, 1, 0);
  this.pointLight = new Vec4(-3, 7, 7, 1);

  this.directionalLightPowerDensity = new Vec3(2, 2, 1.5);
  this.pointLightPowerDensity = new Vec3(50, 50, 20);

  this.lightSources = [this.directionalLight, this.pointLight];
  this.lightPowerDensities = [this.directionalLightPowerDensity,
                              this.pointLightPowerDensity];

  Material.lightPos.at(0).set(this.lightSources[0]);
  // Material.lightPos.at(1).set(this.lightSources[1]);

  Material.lightPowerDensity.at(0).set(this.lightPowerDensities[0]);
  // Material.lightPowerDensity.at(1).set(this.lightPowerDensities[1]);

  Material.spotDir.at(0).set(new Vec3(1, 1, 1));
  // Material.spotDir.at(1).set(new Vec3(0, 1, 0));
};

Scene.prototype.boardSetup = function() {
  this.boardQuadric = new Mat4(
      [0, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 0, 0,
       0, 0, 0, -1]);
  this.boardClipper1 = new Mat4(
      [1, 0, 0, 0,
       0, 0, 0, 0,
       0, 0, 0, 0,
       0, 0, 0, -1024]);
  this.boardClipper2 = new Mat4(
      [0, 0, 0, 0,
       0, 0, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, -1024]);
  Material.quadrics.at(0).set(this.boardQuadric);
  Material.quadrics.at(1).set(this.boardClipper1);
  Material.quadrics.at(2).set(this.boardClipper2);
  Material.brdfs.at(0).set(0, 0, 0, 0);
  Material.brdfs.at(1).set(0, 0, 0, 0);
  Material.brdfs.at(2).set(0, 0, 0, 0);
};

Scene.prototype.makeGoldSilverUniforms = function() {
  let one = new Vec3(1.0, 1.0, 1.0);
  let goldU = new Vec3(0.21, 0.485, 1.29);
  let goldK = new Vec3(3.13, 2.23, 1.76);
  let goldR0Top = goldU.minus(one).times(goldU.minus(one)).plus(goldK.times(goldK));
  let goldR0Bottom = goldU.plus(one).times(goldU.plus(one)).plus(goldK.times(goldK));
  Material.goldR0.set(goldR0Top.over(goldR0Bottom));

  let silverU = new Vec3(0.15, 0.14, 0.13);
  let silverK = new Vec3(3.7, 3.11, 2.47);
  let silverR0Top = silverU.minus(one).times(silverU.minus(one)).plus(silverK.times(silverK));
  let silverR0Bottom = silverU.plus(one).times(silverU.plus(one)).plus(silverK.times(silverK));
  Material.silverR0.set(silverR0Top.over(silverR0Bottom));
}

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