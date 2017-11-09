var PerspectiveCamera = function(avatar) 
{ 
  this.avatar = avatar;

  this.position = new Vec3(0.0, 0.0, 0.0); 
  this.ahead = new Vec3(0.0, 0.0, -1.0); 
  this.right = new Vec3(1.0, 0.0, 0.0); 
  this.up = new Vec3(0.0, 1.0, 0.0);  
  
  this.yaw = 0.0; 
  this.pitch = 0.0; 
  this.fov = 1.0; 
  this.aspect = 1.0; 
  this.nearPlane = 0.1; 
  this.farPlane = 1000.0; 

  // Motion
  this.speed = 10;
  
  this.isDragging = false; 
  this.mouseDelta = new Vec2(0.0, 0.0);

  this.heartSpeed = 0;

  // Matrices
  this.viewMatrix = new Mat4(); 
  this.projMatrix = new Mat4();
  this.viewProjMatrix = new Mat4();  
  this.updateViewMatrix();
  this.updateProjMatrix();

};

PerspectiveCamera.worldUp = new Vec3(0, 1, 0);

PerspectiveCamera.prototype.updateViewMatrix = function(){ 
  this.viewMatrix.set( 
    this.right.x          ,  this.right.y      ,  this.right.z       , 0, 
    this.up.x             ,  this.up.y         ,  this.up.z          , 0, 
   -this.ahead.x          , -this.ahead.y      ,  -this.ahead.z      , 0, 
    0  , 0  , 0   , 1).translate(this.position).invert();
  
  this.viewProjMatrix.set(this.viewMatrix).mul(this.projMatrix); 
   
};

PerspectiveCamera.prototype.updateProjMatrix = function(){ 
  var yScale = 1.0 / Math.tan(this.fov * 0.5); 
  var xScale = yScale / this.aspect; 
  var f = this.farPlane; 
  var n = this.nearPlane; 
  this.projMatrix.set( 
      xScale ,    0    ,      0       ,   0, 
        0    ,  yScale ,      0       ,   0, 
        0    ,    0    ,  (n+f)/(n-f) ,  -1, 
        0    ,    0    ,  2*n*f/(n-f) ,   0); 
  this.viewProjMatrix.set(this.viewMatrix).
                      mul(this.projMatrix); 
}; 

PerspectiveCamera.prototype.move = function(dt, keysPressed) { 
  if(this.isDragging){ 
    this.yaw -= this.mouseDelta.x * 0.002; 
    this.pitch -= this.mouseDelta.y * 0.002; 
    if(this.pitch > 3.14/2.0) { 
      this.pitch = 3.14/2.0; 
    } 
    if(this.pitch < -3.14/2.0) { 
      this.pitch = -3.14/2.0; 
    }

    this.mouseDelta = new Vec2(0.0, 0.0);    
  }


  this.position.set(new Vec3(this.avatar.position)).addScaled(-45, this.ahead).addScaled(8, this.up);

  // keep camera above the ground
  if (this.position.y < 0) {
    this.position.y = 0;
  }


  // Heart Curve
  if (keysPressed.T) {
      // x = 16sin^3t  
      // y = 13cost-5cos(2t)-2cos(3t)-cos(4t)
      this.heartSpeed += dt;

      this.position.x = (16 * Math.pow(Math.sin(this.heartSpeed), 3) + this.avatar.position.x) * 3;
      this.position.z = ((13 * Math.cos(this.heartSpeed)) -
                          (5 * Math.cos(2 * this.heartSpeed)) -
                          (2 * Math.cos(3 * this.heartSpeed)) - 
                          Math.cos(4 * this.heartSpeed) + 
                          this.avatar.position.z) * 3;
      console.log(this.position);
    }

    
    this.ahead = new Vec3(
     -Math.sin(this.yaw)*Math.cos(this.pitch),
      Math.sin(this.pitch),
     -Math.cos(this.yaw)*Math.cos(this.pitch) ); 
    this.right.setVectorProduct(
      this.ahead,
      PerspectiveCamera.worldUp ); 
    this.right.normalize(); 
    this.up.setVectorProduct(this.right, this.ahead); 

  // if(keysPressed.W) { 
  //   this.avatar.position.addScaled(this.speed * dt, this.ahead); 
  // } 
  // if(keysPressed.S) { 
  //   this.avatar.position.addScaled(-this.speed * dt, this.ahead); 
  // } 
  // if(keysPressed.D) { 
  //   this.avatar.position.addScaled(this.speed * dt, this.right); 
  // } 
  // if(keysPressed.A) { 
  //   this.avatar.position.addScaled(-this.speed * dt, this.right); 
  // } 
  // if(keysPressed.E) { 
  //   this.avatar.position.addScaled(this.speed * dt, PerspectiveCamera.worldUp); 
  // } 
  // if(keysPressed.Q) { 
  //   this.avatar.position.addScaled(-this.speed * dt, PerspectiveCamera.worldUp); 
  // }

  this.updateViewMatrix(); 
};

PerspectiveCamera.prototype.mouseDown = function() { 
  this.isDragging = true; 
  this.mouseDelta.set(); 
}; 
  
PerspectiveCamera.prototype.mouseMove = function(event) { 
  this.mouseDelta.x += event.movementX; 
  this.mouseDelta.y += event.movementY; 
  event.preventDefault();  
}; 
  
PerspectiveCamera.prototype.mouseUp = function() { 
  this.isDragging = false; 
};

// ar: canvas.clientWidth / canvas.clientHeight
PerspectiveCamera.prototype.setAspectRatio = function(ar) 
{ 
  this.aspect = ar; 
  this.updateProjMatrix(); 
};

