"use strict";
let Scene = function(gl) {
  // Shiny setup
  this.setup(gl);

  // Light
  this.lightInfo();

  // Board
  this.boardSetup();
  
  // Quadrics Array
  this.quadricsArray = [];
  this.maxQuadrics = 96;

  // Pawns 0-63
  this.makePawns();

  // Kings 64 - 71
  this.makeKings();

  // Queens 72 - 79
  this.makeQueens();

  // Bishops 80 - 95
  this.makeBishops();

  // QUADRICS ARRAY TO MATERIAL UNIFORM
  this.quadricsCounter = 0;
  for (var i = 0; i < this.quadricsArray.length; i++) {
    Material.quadrics.at(this.quadricsCounter).set(this.quadricsArray[i].surfaceCoeffMatrix);
    Material.quadrics.at(++this.quadricsCounter).set(this.quadricsArray[i].clipperCoeffMatrix);
    if (++this.quadricsCounter > this.maxQuadrics - 1) {
      break;
    }
  }

  /////// NOT DEALT WITH YET
  // MATERIAL 
  // Material.brdfs.at(0).set(1, 1, 1, 0); 
  // Material.brdfs.at(1).set(1, 1, 1, 0);
};

Scene.prototype.setup = function(gl) {
  // Enable Depth Test
  gl.enable(gl.DEPTH_TEST);

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

  // Camera
  this.camera = new PerspectiveCamera();
  this.camera.position = new Vec3(0.0, 5.0, 15.0);

  this.gameObjects = [];
  this.gameObjects.push(this.envQuad);
};

Scene.prototype.lightInfo = function() {
  this.directionalLight = new Vec4(0, 1, 0, 0);
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

  Material.spotDir.at(0).set(new Vec3(0, 1, 0));
  // Material.spotDir.at(1).set(this.chevyAvatar.ahead.clone());
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
       0, 0, 0, -64]);
  this.boardClipper2 = new Mat4(
      [0, 0, 0, 0,
       0, 0, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, -64]);
  Material.mcc.at(0).set(this.boardQuadric);
  Material.mcc.at(1).set(this.boardClipper1);
  Material.mcc.at(2).set(this.boardClipper2);
};

Scene.prototype.makePawns = function() {
  for (var i = -7; i < 8; i += 2) {
    let pawn = new ClippedQuadric(new Mat4(), new Mat4());
    pawn.setUnitSphere();
    pawn.transform(new Mat4().translate(i, 1.9, -5));

    let pawnTop = new ClippedQuadric(new Mat4(), new Mat4());
    pawnTop.setUnitCone();
    pawnTop.transform(new Mat4().translate(i, 3.2, -5));

    this.quadricsArray.push(pawn);
    this.quadricsArray.push(pawnTop);
  }

  for (var i = -7; i < 8; i += 2) {
    let pawn = new ClippedQuadric(new Mat4(), new Mat4());
    pawn.setUnitSphere();
    pawn.transform(new Mat4().translate(i, 1.9, 5));

    let pawnTop = new ClippedQuadric(new Mat4(), new Mat4());
    pawnTop.setUnitCone();
    pawnTop.transform(new Mat4().translate(i, 3.2, 5));

    this.quadricsArray.push(pawn);
    this.quadricsArray.push(pawnTop);
  }
};

Scene.prototype.makeKings = function() {
  let king = new ClippedQuadric(new Mat4(), new Mat4());
  king.setUnitCylinder();
  king.transform(new Mat4().translate(1, 2, 7));

  let kingTop = new ClippedQuadric(new Mat4(), new Mat4());
  kingTop.surfaceCoeffMatrix.set(  
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 1, 0, 0);
  kingTop.clipperCoeffMatrix.set(  
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  kingTop.transform(new Mat4().translate(1, 3.9, 7));



  let king2 = new ClippedQuadric(new Mat4(), new Mat4());
  king2.setUnitCylinder();
  king2.transform(new Mat4().translate(1, 2, -7));

  let king2Top = new ClippedQuadric(new Mat4(), new Mat4());
  king2Top.surfaceCoeffMatrix.set(  
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 1, 0, 0);
  king2Top.clipperCoeffMatrix.set(  
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  king2Top.transform(new Mat4().translate(1, 3.9, -7));

    
  this.quadricsArray.push(king);
  this.quadricsArray.push(kingTop);
  this.quadricsArray.push(king2);
  this.quadricsArray.push(king2Top);
};

Scene.prototype.makeQueens = function() {
  let queen = new ClippedQuadric(new Mat4(), new Mat4());
  queen.surfaceCoeffMatrix.set(  
    1, 0, 0, 0,
    0, -.2, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -.2);
  queen.clipperCoeffMatrix.set(  
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  queen.transform(new Mat4().translate(-1, 2, 7));

  let queenTop = new ClippedQuadric(new Mat4(), new Mat4());
  queenTop.surfaceCoeffMatrix.set(  
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, .4, 0, 0);
  queenTop.clipperCoeffMatrix.set(  
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  queenTop.transform(new Mat4().translate(-1, 4, 7));

  let queen2 = new ClippedQuadric(new Mat4(), new Mat4());
  queen2.surfaceCoeffMatrix.set(  
    1, 0, 0, 0,
    0, -.2, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -.2);
  queen2.clipperCoeffMatrix.set(  
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  queen2.transform(new Mat4().translate(-1, 2, -7));

  let queen2Top = new ClippedQuadric(new Mat4(), new Mat4());
  queen2Top.surfaceCoeffMatrix.set(  
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, .4, 0, 0);
  queen2Top.clipperCoeffMatrix.set(  
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  queen2Top.transform(new Mat4().translate(-1, 4, -7));

  this.quadricsArray.push(queen);
  this.quadricsArray.push(queenTop);
  this.quadricsArray.push(queen2);
  this.quadricsArray.push(queen2Top);
};

Scene.prototype.makeBishops = function() {
  // bishops 1st side
  let bishop = new ClippedQuadric(new Mat4(), new Mat4());
  bishop.clipperCoeffMatrix.set(  
    2, 0, 0, 0,
    0, .5, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, -.5);
  bishop.surfaceCoeffMatrix.set(  
    -1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, .08);
  bishop.transform(new Mat4().translate(-3, 2.4, 7));
  bishop.transformClipper(new Mat4().translate(0, .4, 0));

  let bishopOutside = new ClippedQuadric(new Mat4(), new Mat4());
  bishopOutside.surfaceCoeffMatrix.set(  
    2, 0, 0, 0,
    0, .5, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, -.5);
  bishopOutside.clipperCoeffMatrix.set(  
    -1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, .08);
  bishopOutside.transform(new Mat4().translate(-3, 2, 7));
  bishopOutside.transformClipper(new Mat4().translate(0, .4, 0));

  let bishop2 = new ClippedQuadric(new Mat4(), new Mat4());
  bishop2.clipperCoeffMatrix.set(  
    2, 0, 0, 0,
    0, .5, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, -.5);
  bishop2.surfaceCoeffMatrix.set(  
    -1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, .08);
  bishop2.transform(new Mat4().translate(3, 2.4, 7));
  bishop2.transformClipper(new Mat4().translate(0, .4, 0));

  let bishop2Outside = new ClippedQuadric(new Mat4(), new Mat4());
  bishop2Outside.surfaceCoeffMatrix.set(  
    2, 0, 0, 0,
    0, .5, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, -.5);
  bishop2Outside.clipperCoeffMatrix.set(  
    -1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, .08);
  bishop2Outside.transform(new Mat4().translate(3, 2, 7));
  bishop2Outside.transformClipper(new Mat4().translate(0, .4, 0));

  // bishops 2nd side
  let bishop3 = new ClippedQuadric(new Mat4(), new Mat4());
  bishop3.clipperCoeffMatrix.set(  
    2, 0, 0, 0,
    0, .5, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, -.5);
  bishop3.surfaceCoeffMatrix.set(  
    -1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, .08);
  bishop3.transform(new Mat4().translate(-3, 2.4, -7));
  bishop3.transformClipper(new Mat4().translate(0, .4, 0));

  let bishop3Outside = new ClippedQuadric(new Mat4(), new Mat4());
  bishop3Outside.surfaceCoeffMatrix.set(  
    2, 0, 0, 0,
    0, .5, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, -.5);
  bishop3Outside.clipperCoeffMatrix.set(  
    -1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, .08);
  bishop3Outside.transform(new Mat4().translate(-3, 2, -7));
  bishop3Outside.transformClipper(new Mat4().translate(0, .4, 0));

  let bishop4 = new ClippedQuadric(new Mat4(), new Mat4());
  bishop4.clipperCoeffMatrix.set(  
    2, 0, 0, 0,
    0, .5, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, -.5);
  bishop4.surfaceCoeffMatrix.set(  
    -1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, .08);
  bishop4.transform(new Mat4().translate(3, 2.4, -7));
  bishop4.transformClipper(new Mat4().translate(0, .4, 0));

  let bishop4Outside = new ClippedQuadric(new Mat4(), new Mat4());
  bishop4Outside.surfaceCoeffMatrix.set(  
    2, 0, 0, 0,
    0, .5, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, -.5);
  bishop4Outside.clipperCoeffMatrix.set(  
    -1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, .08);
  bishop4Outside.transform(new Mat4().translate(3, 2, -7));
  bishop4Outside.transformClipper(new Mat4().translate(0, .4, 0));

  this.quadricsArray.push(bishop);
  this.quadricsArray.push(bishopOutside);
  this.quadricsArray.push(bishop2);
  this.quadricsArray.push(bishop2Outside);
  this.quadricsArray.push(bishop3);
  this.quadricsArray.push(bishop3Outside);
  this.quadricsArray.push(bishop4);
  this.quadricsArray.push(bishop4Outside);
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