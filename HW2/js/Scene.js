"use strict";
let Scene = function(gl) {

  // Enable Depth Test
  gl.enable(gl.DEPTH_TEST);

  // 3D
  this.vsTextured3D = new Shader(gl, gl.VERTEX_SHADER, "textured_vs3D.essl");
  this.fsTextured3D = new Shader(gl, gl.FRAGMENT_SHADER, "textured_fs3D.essl");
  this.texturedProgram3D = new TexturedProgram(gl, this.vsTextured3D, this.fsTextured3D);

  // Post Processing 
  this.fsTextured3DPost = new Shader(gl, gl.FRAGMENT_SHADER, "postproc_fs.essl");
  this.postprocProgram3D = new TexturedProgram(gl, this.vsTextured3D, this.fsTextured3DPost);

  // Shadow
  this.vsShadow3D = new Shader(gl, gl.VERTEX_SHADER, "shadow_vs3D.essl");
  this.fsShadow3D = new Shader(gl, gl.FRAGMENT_SHADER, "shadow_fs3D.essl");
  this.shadowProgram3D = new Program(gl, this.vsShadow3D, this.fsShadow3D);
  this.shadowMaterial = [new Material(gl, this.shadowProgram3D)];
  var shadowMat = new Mat4([1, 0,  0, 0,
                           -1, 0, -1, 0,
                            0, 0,  1, 0,
                            0, 0, 0, 1]);
  var treeShadowMat = new Mat4([1, 0,  0, 0,
                              -1,  0, -1, 0,
                               0,  0,  1, 0,
                            -3.5,  0, -3.5, 1]);


  // Post Proc Obj
  this.materialPostProc = [new Material(gl, this.postprocProgram3D),
                           new Material(gl, this.postprocProgram3D)];
  this.multiMeshPostProc = new MultiMesh(gl, "img/tree.json", this.materialPostProc);
  this.postProcAvatar = new GameObject(this.multiMeshPostProc);
  this.postProcAvatar.position.set(new Vec3(-20, 0, 0));

  // Post Proc Shadow
  this.postprocShadowMesh = new MultiMesh(gl, "img/tree.json", this.shadowMaterial);
  this.postprocShadow = new GameObject(this.postprocShadowMesh);
  this.postprocShadow.shadowMatrix = treeShadowMat.clone();
  this.postprocShadow.parent = this.postProcAvatar;

  // 3D Chevy
  this.texture2DChevy = new Texture2D(gl, "img/chevy/chevy.png");
  this.materials3DChevy = [new Material(gl, this.texturedProgram3D)];
  this.materials3DChevy[0].colorTexture.set(this.texture2DChevy);
  this.multiMeshChevy = new MultiMesh(gl, "img/chevy/chassis.json", this.materials3DChevy);
  this.chevyAvatar = new GameObject(this.multiMeshChevy);
  this.chevyAvatar.position.set(new Vec3(-3.2215, 6.6555, -3.0808598));
  this.chevyAvatar.scale.set(new Vec3(.5, .5, .5));
  this.chevyAvatar.orientation = Math.PI;

  // Chevy Shadow
  this.chevyShadowMesh = new MultiMesh(gl, "img/chevy/chassis.json", this.shadowMaterial);
  this.chevyShadowObj = new GameObject(this.chevyShadowMesh);
  this.chevyShadowObj.shadowMatrix = shadowMat.clone();
  this.chevyShadowObj.parent = this.chevyAvatar;

  // 3D Heli Rotor
  this.multiMeshRotor = new MultiMesh(gl, "img/heli/mainrotor.json",
                        [this.materials3DChevy[0], this.materials3DChevy[0]]);
  this.chevyRotor = new GameObject(this.multiMeshRotor);
  this.chevyRotor.position.set(new Vec3(0, 7, 1.7));
  this.chevyRotor.scale.set(new Vec3(.7, .7, .7));
  this.chevyRotor.parent = this.chevyAvatar;

  // Rotor Shadow
  this.rotorShadowMesh = new MultiMesh(gl, "img/heli/mainrotor.json",
                          [this.shadowMaterial[0], this.shadowMaterial[0]]);
  this.rotorShadowObj = new GameObject(this.rotorShadowMesh);
  this.rotorShadowObj.shadowMatrix = shadowMat.clone();
  this.rotorShadowObj.parent = this.chevyRotor;

  // 3D Chevy Wheels
  this.multiMeshWheel = new MultiMesh(gl, "img/chevy/wheel.json", this.materials3DChevy);
  this.wheelShadowMesh = new MultiMesh(gl, "img/chevy/wheel.json", this.shadowMaterial);

  this.chevyWheelFL = new GameObject(this.multiMeshWheel);
  this.chevyWheelFL.position.set(new Vec3(6.8, -3.3, 11.2));
  this.chevyWheelFL.scale.set(new Vec3(1.1, 1.1, 1.1));
  this.chevyWheelFL.parent = this.chevyAvatar;


  this.chevyWheelFR = new GameObject(this.multiMeshWheel);
  this.chevyWheelFR.position.set(new Vec3(-6.8, -3.3, 11.2));
  this.chevyWheelFR.scale.set(new Vec3(1.1, 1.1, 1.1));
  this.chevyWheelFR.parent = this.chevyAvatar;

  this.chevyWheelBR = new GameObject(this.multiMeshWheel);
  this.chevyWheelBR.position.set(new Vec3(-6.8, -3.3, -13.67));
  this.chevyWheelBR.scale.set(new Vec3(1.1, 1.1, 1.1));
  this.chevyWheelBR.parent = this.chevyAvatar;

  this.chevyWheelBL = new GameObject(this.multiMeshWheel);
  this.chevyWheelBL.position.set(new Vec3(6.8, -3.3, -13.67));
  this.chevyWheelBL.scale.set(new Vec3(1.1, 1.1, 1.1));
  this.chevyWheelBL.parent = this.chevyAvatar;


  this.wheelShadowObjFL = new GameObject(this.wheelShadowMesh);
  this.wheelShadowObjFL.shadowMatrix = shadowMat.clone();
  this.wheelShadowObjFL.parent = this.chevyWheelFL;

  this.wheelShadowObjFR = new GameObject(this.wheelShadowMesh);
  this.wheelShadowObjFR.shadowMatrix = shadowMat.clone();
  this.wheelShadowObjFR.parent = this.chevyWheelFR;

  this.wheelShadowObjBR = new GameObject(this.wheelShadowMesh);
  this.wheelShadowObjBR.shadowMatrix = shadowMat.clone();
  this.wheelShadowObjBR.parent = this.chevyWheelBR;

  this.wheelShadowObjBL = new GameObject(this.wheelShadowMesh);
  this.wheelShadowObjBL.shadowMatrix = shadowMat.clone();
  this.wheelShadowObjBL.parent = this.chevyWheelBL;


  // Ground Zero
  this.texture2DGround = new Texture2D(gl, "img/concrete.jpg");
  this.materialGround = new Material(gl, this.texturedProgram3D);
  this.materialGround.colorTexture.set(this.texture2DGround);
  this.texturedQuadGeometry = new TexturedQuadGeometry(gl);
  this.meshGround = new Mesh(this.texturedQuadGeometry, this.materialGround);
  
  this.groundGameObject = new GameObject(this.meshGround);
  this.groundGameObject.position.set(new Vec3(0,-.1,0));


  // Time
  this.timeAtLastFrame = new Date().getTime();

  // Light
  this.directionalLight = new Vec4(.5, 1, 0, 0);
  this.pointLight = new Vec4(this.chevyAvatar.position.clone()
                              .addScaled(45, this.chevyAvatar.ahead)
                              .addScaled(8, this.chevyAvatar.up), 1);
  this.directionalLightPowerDensity = new Vec3(1, 1, 1);
  this.pointLightPowerDensity = new Vec3(2000, 2000, 200);


  this.lightSources = [this.directionalLight, this.pointLight];
  this.lightPowerDensities = [this.directionalLightPowerDensity,
                              this.pointLightPowerDensity];

  Material.lightPos.at(0).set(this.lightSources[0]);
  Material.lightPos.at(1).set(this.lightSources[1]);

  Material.lightPowerDensity.at(0).set(this.lightPowerDensities[0]);
  Material.lightPowerDensity.at(1).set(this.lightPowerDensities[1]);

  Material.spotDir.at(0).set(new Vec3(.5, 1, 0));
  Material.spotDir.at(1).set(this.chevyAvatar.ahead.clone());


  // With one light source
  // Material.lightDirection.set(new Vec3(0, 1, 0));
  // Material.lightPowerDensity = new Vec4(1, 1, 1, 1);
  // Material.spotDir.set([new Vec3(0, 1, 0), this.chevyAvatar.ahead]);
  // Material.lightPos = this.lightSources;
  // Material.lightPowerDensity = this.lightPowerDensities;
    
  // Camera
  this.camera = new PerspectiveCamera(this.chevyAvatar);

  this.gameObjects = [];
  this.gameObjects.push(this.groundGameObject);
  this.gameObjects.push(this.chevyAvatar);
  this.gameObjects.push(this.chevyRotor);
  this.gameObjects.push(this.chevyWheelFL);
  this.gameObjects.push(this.chevyWheelFR);
  this.gameObjects.push(this.chevyWheelBR);
  this.gameObjects.push(this.chevyWheelBL);
  this.gameObjects.push(this.chevyShadowObj);
  this.gameObjects.push(this.rotorShadowObj);
  this.gameObjects.push(this.wheelShadowObjFL);
  this.gameObjects.push(this.wheelShadowObjFR);
  this.gameObjects.push(this.wheelShadowObjBR);
  this.gameObjects.push(this.wheelShadowObjBL);
  this.gameObjects.push(this.postProcAvatar);
  this.gameObjects.push(this.postprocShadow);
  
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

  // Light update
  this.pointLight = new Vec4(this.chevyAvatar.position.clone()
                            .addScaled(45, this.chevyAvatar.ahead)
                            .addScaled(8, this.chevyAvatar.up), 1);
  if (keysPressed.M) {
    console.log(this.chevyAvatar.position, this.pointLight);
  }
  Material.lightPos.at(1).set(this.pointLight);
  Material.spotDir.at(1).set(this.chevyAvatar.ahead.clone());

  // spin wheels
  this.chevyRotor.yaw += (Math.PI/9 + .1);

  // call camera move
  this.camera.move(dt, keysPressed);

  // Chevy Movement
  this.chevyAvatar.velocity = new Vec3(0, 0, 0);
  if(keysPressed.W) { 
    this.chevyAvatar.velocity.add(this.chevyAvatar.ahead);
    this.chevyAvatar.move(dt);
    this.chevyWheelFL.pitch -= (Math.PI/9 + .2);
    this.chevyWheelBL.pitch -= (Math.PI/9 + .2);
    this.chevyWheelFR.pitch -= (Math.PI/9 + .2);
    this.chevyWheelBR.pitch -= (Math.PI/9 + .2);
  } 
  if(keysPressed.S) { 
    this.chevyAvatar.velocity.add(this.chevyAvatar.ahead);
    this.chevyAvatar.move(-1 * dt);

    this.chevyWheelFL.pitch += (Math.PI/9 + .2);
    this.chevyWheelBL.pitch += (Math.PI/9 + .2);
    this.chevyWheelFR.pitch += (Math.PI/9 + .2);
    this.chevyWheelBR.pitch += (Math.PI/9 + .2);
  } 
  if(keysPressed.D) { 
    this.chevyAvatar.velocity.add(this.chevyAvatar.right);
    this.chevyAvatar.move(dt);
  } 
  if(keysPressed.A) { 
    this.chevyAvatar.velocity.add(this.chevyAvatar.right);
    this.chevyAvatar.move(-1 * dt); 
  } 
  if(keysPressed.E) { 
    this.chevyAvatar.velocity.add(this.chevyAvatar.worldUp);
    this.chevyAvatar.move(dt); 
  } 
  if(keysPressed.Q) { 
    this.chevyAvatar.velocity.add(this.chevyAvatar.worldUp);
    this.chevyAvatar.move(-1 * dt); 
  }

  // bound at the floor
  if (this.chevyAvatar.position.y < 3) {
    this.chevyAvatar.position.y = 3;
  }


  if(keysPressed.LEFT) { 
    this.chevyAvatar.yaw += .01;
    this.chevyAvatar.updateOrientation();
  }
  if(keysPressed.RIGHT) { 
    this.chevyAvatar.yaw -= .01;
    this.chevyAvatar.updateOrientation();
  }
  if(keysPressed.UP) { 
    this.chevyAvatar.pitch += .01;
    this.chevyAvatar.updateOrientation();
  }
  if(keysPressed.DOWN) { 
    this.chevyAvatar.pitch -= .01;
    this.chevyAvatar.updateOrientation();
  }

  if(this.chevyAvatar.pitch >= 3.14/2.0 - .01) { 
    this.chevyAvatar.pitch = 3.14/2.0 - .01; 
  } 
  if(this.chevyAvatar.pitch <= -3.14/2.0 + .01) { 
    this.chevyAvatar.pitch = -3.14/2.0 + .01;
  }

  let theScene = this;
  this.gameObjects.forEach( function(gameObject) {
    gameObject.draw(theScene.camera);
  });
};


