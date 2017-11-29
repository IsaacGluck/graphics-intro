"use strict";
let Scene = function(gl) {
  this.pawnCounter = 33;
  this.pawnDown = true;
  // this.pawnGo = true;
  this.pawnGo = false;

  this.bishopCounter = 65;
  this.bishopDown = true;
  this.bishopGo = false;

  // Shiny setup
  this.setup(gl);

  // Light
  this.lightInfo();

  // Board
  this.boardSetup();
  
  // Quadrics Array
  this.quadricsArray = [];
  this.maxQuadrics = 104;

  // WHITE PIECES
  // 0 - 31
  this.makeWhitePawns();

  // 32 - 35
  this.makeWhiteKing();

  // 36 - 39
  this.makeWhiteQueen();

  // 40 - 47
  this.makeWhiteBishops();

  // 48 - 51
  this.makeWhiteRooks();
  

  // BLACK PIECES
  // 52 - 83
  this.makeBlackPawns();

  // 84 - 87
  this.makeBlackKing();

  // 88 - 91
  this.makeBlackQueen();

  // 92 - 99
  this.makeBlackBishops();

  // 100 - 103
  this.makeBlackRooks();
  



  // Pawns 0-63
  // this.makeBlackPawns();

  // Kings 64 - 71
  // this.makeBlackKing();

  // Queens 72 - 79
  // this.makeBlackQueen();

  // Bishops 80 - 95
  //black
  // this.makeBlackBishops();

  // Rooks 96 - 104
  //   mcc: 4 - 27
  //black
  // this.makeRook(-7, 7, 3);
  // this.makeRook(7, 7, 30);
  

  // this.quadricsArray[6].transform(new Mat4().translate(0, 0, 4));
  // this.quadricsArray[7].transform(new Mat4().translate(0, 0, 4));


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
  for (var i = 0; i < 52; i++) {
    Material.brdfs.at(i).set(1, 1, 1, 0);
  }
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
  this.directionalLight = new Vec4(1, 1, -1, 0);
  this.pointLight = new Vec4(-3, 7, 7, 1);

  this.directionalLightPowerDensity = new Vec3(.9, .9, .7);
  this.pointLightPowerDensity = new Vec3(50, 50, 20);

  this.lightSources = [this.directionalLight, this.pointLight];
  this.lightPowerDensities = [this.directionalLightPowerDensity,
                              this.pointLightPowerDensity];

  Material.lightPos.at(0).set(this.lightSources[0]);
  Material.lightPos.at(1).set(this.lightSources[1]);

  Material.lightPowerDensity.at(0).set(this.lightPowerDensities[0]);
  Material.lightPowerDensity.at(1).set(this.lightPowerDensities[1]);

  Material.spotDir.at(0).set(new Vec3(1, 1, -1));
  Material.spotDir.at(1).set(new Vec3(0, 1, 0));
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

Scene.prototype.makeWhitePawns = function() {
  for (var i = -7; i < 8; i += 2) {
    let pawn = new ClippedQuadric(new Mat4(), new Mat4());
    pawn.setUnitSphere();
    pawn.transform(new Mat4().translate(i, 1.9, -5));

    let pawnTop = new ClippedQuadric(new Mat4(), new Mat4());
    pawnTop.setUnitCone();
    pawnTop.transform(new Mat4().translate(i, 3.4, -5));

    this.quadricsArray.push(pawn);
    this.quadricsArray.push(pawnTop);
  }
};

Scene.prototype.makeBlackPawns = function() {
  for (var i = -7; i < 8; i += 2) {
    let pawn = new ClippedQuadric(new Mat4(), new Mat4());
    pawn.setUnitSphere();
    pawn.transform(new Mat4().translate(i, 1.9, 5));

    let pawnTop = new ClippedQuadric(new Mat4(), new Mat4());
    pawnTop.setUnitCone();
    pawnTop.transform(new Mat4().translate(i, 3.4, 5));

    this.quadricsArray.push(pawn);
    this.quadricsArray.push(pawnTop);
  }
}

Scene.prototype.makeWhiteKing = function() {
  let king = new ClippedQuadric(new Mat4(), new Mat4());
  king.setUnitCylinder();
  king.transform(new Mat4().translate(1, 2, -7));

  let kingTop = new ClippedQuadric(new Mat4(), new Mat4());
  kingTop.surfaceCoeffMatrix.set(  
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, .9, 0, 0);
  kingTop.clipperCoeffMatrix.set(  
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  kingTop.transform(new Mat4().translate(1, 3.9, -7));
  
  this.quadricsArray.push(king);
  this.quadricsArray.push(kingTop);
};

Scene.prototype.makeBlackKing = function() {
  let king = new ClippedQuadric(new Mat4(), new Mat4());
  king.setUnitCylinder();
  king.transform(new Mat4().translate(1, 2, 7));

  let kingTop = new ClippedQuadric(new Mat4(), new Mat4());
  kingTop.surfaceCoeffMatrix.set(  
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, .9, 0, 0);
  kingTop.clipperCoeffMatrix.set(  
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  kingTop.transform(new Mat4().translate(1, 3.9, 7));
  this.quadricsArray.push(king);
  this.quadricsArray.push(kingTop);
}

Scene.prototype.makeBlackQueen = function() {
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

  this.quadricsArray.push(queen);
  this.quadricsArray.push(queenTop);
};

Scene.prototype.makeWhiteQueen = function() {
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
  queen.transform(new Mat4().translate(-1, 2, -7));

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
  queenTop.transform(new Mat4().translate(-1, 4, -7));
  this.quadricsArray.push(queen);
  this.quadricsArray.push(queenTop);
}

Scene.prototype.makeBishop = function(x, z) {
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
  bishop.transform(new Mat4().translate(x, 2.4, z));
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
  bishopOutside.transform(new Mat4().translate(x, 2, z));
  bishopOutside.transformClipper(new Mat4().translate(0, .4, 0));

  this.quadricsArray.push(bishop);
  this.quadricsArray.push(bishopOutside);
}

Scene.prototype.makeWhiteBishops = function() {
  this.makeBishop(3, -7);
  this.makeBishop(-3, -7);
}

Scene.prototype.makeBlackBishops = function() {
  this.makeBishop(3, 7);
  this.makeBishop(-3, 7);
}

Scene.prototype.makeRook = function(x, z, startingMccIndex) {
  let rook = new ClippedQuadric(new Mat4(), new Mat4());
  rook.surfaceCoeffMatrix.set(  
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -.5);
  rook.clipperCoeffMatrix.set(  
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -.7);
  rook.transform(new Mat4().translate(x, 1.84, z));
  this.quadricsArray.push(rook);


  let rookTopSide1 = new ClippedTwiceQuadric(new Mat4(), new Mat4(), new Mat4());
  rookTopSide1.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -.5);
  rookTopSide1.clipperCoeffMatrix.set(
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -.5);
  rookTopSide1.clipperCoeffMatrix2.set(
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -.5);
  rookTopSide1.transform(new Mat4().translate(x, 2.8, z));

  Material.mcc.at(startingMccIndex).set(rookTopSide1.surfaceCoeffMatrix);
  Material.mcc.at(startingMccIndex + 1).set(rookTopSide1.clipperCoeffMatrix);
  Material.mcc.at(startingMccIndex + 2).set(rookTopSide1.clipperCoeffMatrix2);

  let rookTopBottom = new ClippedTwiceQuadric(new Mat4(), new Mat4(), new Mat4());
  rookTopBottom.surfaceCoeffMatrix.set(
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -.5);
  rookTopBottom.clipperCoeffMatrix.set(
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -.5);
  rookTopBottom.clipperCoeffMatrix2.set(
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -.5);
  rookTopBottom.transform(new Mat4().translate(x, 2.8, z));

  Material.mcc.at(startingMccIndex + 3).set(rookTopBottom.surfaceCoeffMatrix);
  Material.mcc.at(startingMccIndex + 4).set(rookTopBottom.clipperCoeffMatrix);
  Material.mcc.at(startingMccIndex + 5).set(rookTopBottom.clipperCoeffMatrix2);

  let rookTopSide2 = new ClippedTwiceQuadric(new Mat4(), new Mat4(), new Mat4());
  rookTopSide2.surfaceCoeffMatrix.set(
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -.5);
  rookTopSide2.clipperCoeffMatrix.set(
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -.5);
  rookTopSide2.clipperCoeffMatrix2.set(
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -.5);
  rookTopSide2.transform(new Mat4().translate(x, 2.8, z));

  Material.mcc.at(startingMccIndex + 6).set(rookTopSide2.surfaceCoeffMatrix);
  Material.mcc.at(startingMccIndex + 7).set(rookTopSide2.clipperCoeffMatrix);
  Material.mcc.at(startingMccIndex + 8).set(rookTopSide2.clipperCoeffMatrix2);
};

Scene.prototype.makeWhiteRooks = function() {
  this.makeRook(-7, -7, 12);
  this.makeRook(7, -7, 21);
};

Scene.prototype.makeBlackRooks = function() {
  this.makeRook(-7, 7, 3);
  this.makeRook(7, 7, 30);  
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

  if (this.pawnGo) {
    if (this.pawnCounter == 0 && this.pawnDown) {
      this.pawnDown = !this.pawnDown;
      this.pawnGo = false;
      this.bishopGo = true;
    } else if (this.pawnCounter == 33 && !this.pawnDown) {
      this.pawnDown = !this.pawnDown;
    } else if (this.pawnCounter > 0 && this.pawnDown) {
      // console.log(this.quadricsArray[0]);
      this.quadricsArray[6].transform(new Mat4().translate(0, 0, .125));
      this.quadricsArray[7].transform(new Mat4().translate(0, 0, .125));
      Material.quadrics.at(12).set(this.quadricsArray[6].surfaceCoeffMatrix);
      Material.quadrics.at(13).set(this.quadricsArray[6].clipperCoeffMatrix);
      Material.quadrics.at(14).set(this.quadricsArray[7].surfaceCoeffMatrix);
      Material.quadrics.at(15).set(this.quadricsArray[7].clipperCoeffMatrix);
      this.pawnCounter--;
    } else if (this.pawnCounter >= 0 && !this.pawnDown) {
      this.quadricsArray[6].transform(new Mat4().translate(0, 0, -.125));
      this.quadricsArray[7].transform(new Mat4().translate(0, 0, -.125));
      Material.quadrics.at(12).set(this.quadricsArray[6].surfaceCoeffMatrix);
      Material.quadrics.at(13).set(this.quadricsArray[6].clipperCoeffMatrix);
      Material.quadrics.at(14).set(this.quadricsArray[7].surfaceCoeffMatrix);
      Material.quadrics.at(15).set(this.quadricsArray[7].clipperCoeffMatrix);
      this.pawnCounter++;
    }
  }

  if (this.bishopGo) {
    if (this.bishopCounter == 0 && this.bishopDown) {
      this.bishopDown = !this.bishopDown;
    } else if (this.bishopCounter == 65 && !this.bishopDown) {
      this.bishopDown = !this.bishopDown;
      this.pawnGo = true;
      this.bishopGo = false;
    } else if (this.bishopCounter > 0 && this.bishopDown) {
      // console.log(this.quadricsArray[0]);
      this.quadricsArray[44].transform(new Mat4().translate(.125, 0, .125));
      this.quadricsArray[45].transform(new Mat4().translate(.125, 0, .125));
      Material.quadrics.at(88).set(this.quadricsArray[44].surfaceCoeffMatrix);
      Material.quadrics.at(89).set(this.quadricsArray[44].clipperCoeffMatrix);
      Material.quadrics.at(90).set(this.quadricsArray[45].surfaceCoeffMatrix);
      Material.quadrics.at(91).set(this.quadricsArray[45].clipperCoeffMatrix);
      this.bishopCounter--;
    } else if (this.bishopCounter >= 0 && !this.bishopDown) {
      this.quadricsArray[44].transform(new Mat4().translate(-.125, 0, -.125));
      this.quadricsArray[45].transform(new Mat4().translate(-.125, 0, -.125));
      Material.quadrics.at(88).set(this.quadricsArray[44].surfaceCoeffMatrix);
      Material.quadrics.at(89).set(this.quadricsArray[44].clipperCoeffMatrix);
      Material.quadrics.at(90).set(this.quadricsArray[45].surfaceCoeffMatrix);
      Material.quadrics.at(91).set(this.quadricsArray[45].clipperCoeffMatrix);
      this.bishopCounter++;
    }
  }

  let theScene = this;

  this.camera.move(dt, keysPressed);

  this.gameObjects.forEach( function(gameObject) {
    gameObject.draw(theScene.camera);
  });
};