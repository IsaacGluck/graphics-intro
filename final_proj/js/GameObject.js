"use strict"; 
let GameObject = function(mesh) { 
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1);
  this.mode = 0;

  this.modelMatrix = new Mat4(); 
};


GameObject.prototype.updateModelMatrix = function() { 
	this.modelMatrix.set().scale(this.scale).rotate(this.orientation).translate(this.position);
};


GameObject.prototype.draw = function(camera) {
  this.updateModelMatrix();

  Material.modelMatrix.set().set(this.modelMatrix);

  Material.modelMatrixInverse.set().mul(this.modelMatrix.clone()).invert();

  Material.modelViewProjMatrix.
    set(this.modelMatrix).
    mul(camera.viewProjMatrix);

  Material.cameraPos.set(camera.position);

  Material.rayDirMatrix.set().translate(camera.position).mul(camera.viewProjMatrix).invert();
    
  this.mesh.draw();
};