"use strict"; 
let GameObject = function(mesh) { 
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0); 
  this.yaw = 0;
  this.pitch = 0;
  this.front = Math.PI;
  this.worldUp = new Vec3(0, 1, 0);
  this.scale = new Vec3(1, 1, 1);

  this.ahead = new Vec3(0.0, 0.0, -1.0); 
  this.right = new Vec3(1.0, 0.0, 0.0); 
  this.up = new Vec3(0.0, 1.0, 0.0);

  this.speed = 10;
  this.velocity = new Vec3(0, 0, 0);

  this.modelMatrix = new Mat4();
};

GameObject.prototype.move = function(dt) {
  
  this.updateOrientation();
  this.position.addScaled(this.speed * dt, this.velocity);

}

GameObject.prototype.updateOrientation = function() {
  this.ahead = new Vec3(
   -Math.sin(this.yaw)*Math.cos(this.pitch),
   Math.sin(this.pitch),
   -Math.cos(this.yaw)*Math.cos(this.pitch) ); 
  this.right.setVectorProduct(
    this.ahead,
    this.worldUp ); 
  this.right.normalize();
  this.up.setVectorProduct(this.right, this.ahead); 

}


GameObject.prototype.updateModelMatrix = function() {
  this.modelMatrix.set().scale(this.scale)
                        .rotate(this.yaw + this.front, this.worldUp)
                        .rotate(this.pitch, this.right)
                        .translate(this.position);

  if (this.parent) {
    this.modelMatrix.scale(this.parent.scale)
                    .rotate(this.parent.yaw, this.parent.worldUp)
                    .rotate(this.parent.pitch, this.parent.right)
                    .translate(this.parent.position);
  }

  if(this.parent && this.parent.parent) {
    this.modelMatrix.scale(this.parent.parent.scale)
                    .rotate(this.parent.parent.yaw, this.parent.parent.worldUp)
                    .rotate(this.parent.parent.pitch, this.parent.parent.right)
                    .translate(this.parent.parent.position);
  }

  if (this.shadowMatrix) {
    this.modelMatrix.mul(this.shadowMatrix);
  }
};


GameObject.prototype.draw = function(camera) {
  this.updateModelMatrix();

  Material.modelMatrix.set().set(this.modelMatrix);

  Material.modelMatrixInverse.set().mul(this.modelMatrix.clone()).invert();

  Material.modelViewProjMatrix.
    set(this.modelMatrix).
    mul(camera.viewProjMatrix);

  this.mesh.draw();
};