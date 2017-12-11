let Quadric = function(surfaceCoeffMatrix) {
	this.surfaceCoeffMatrix = surfaceCoeffMatrix;
};

Quadric.prototype.setUnitSphere = function(){
  this.surfaceCoeffMatrix.set(	
  	1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
};

Quadric.prototype.transform = function(T) {
	let inverseT = new Mat4(T).invert();
	let invertTransposeT = new Mat4(T).invert().transpose();
	this.surfaceCoeffMatrix = this.surfaceCoeffMatrix.premul(inverseT).mul(invertTransposeT);
};