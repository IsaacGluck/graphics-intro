let ClippedQuadric =
          function(surfaceCoeffMatrix, clipperCoeffMatrix) {
						this.surfaceCoeffMatrix = surfaceCoeffMatrix;
						this.clipperCoeffMatrix = clipperCoeffMatrix;
					};

ClippedQuadric.prototype.setUnitSphere = function(){
  this.surfaceCoeffMatrix.set(	
  	1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(	
  	0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
};

ClippedQuadric.prototype.setUnitCylinder = function(){
  this.surfaceCoeffMatrix.set(	
  	1, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(	
  	0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
};

ClippedQuadric.prototype.setUnitCone = function(){
  this.surfaceCoeffMatrix.set(	
  	1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 0);
  this.clipperCoeffMatrix.set(	
  	0, 0, 0, 0,
    0, 1, 0, 1,
    0, 0, 0, 0,
    0, 0, 0, 0);
};

ClippedQuadric.prototype.transform = function(Mat4 T){
	let Mat4 inverseT = new Mat4(T).invert();
	let Mat4 invertTransposeT = new Mat4(T).invert().transpose();
	this.surfaceCoeffMatrix = this.surfaceCoeffMatrix.premul(inverseT).mul(invertTransposeT);
	this.clipperCoeffMatrix = this.clipperCoeffMatrix.premul(inverseT).mul(invertTransposeT);
};