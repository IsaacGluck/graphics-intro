"use strict"; 
let GameObject = function(mesh, type) { 
  this.mesh = mesh;
  this.type = type;

  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(.6, .6, 1);

  this.disappear = false;
  this.replace = false;
  this.oldPosition = this.position;

  this.modelMatrix = new Mat4(); 
};


GameObject.prototype.updateModelMatrix = function(){ 
	this.modelMatrix.set().scale(this.scale).rotate(this.orientation).translate(this.position);
};


GameObject.prototype.draw = function(camera){ 
  this.updateModelMatrix();
  this.mesh.material.modelViewProjMatrix.set(this.modelMatrix.mul(camera.viewProjMatrix));
  this.mesh.draw(); 
};


GameObject.prototype.rotate = function(phi) {
  this.orientation += phi;
};
