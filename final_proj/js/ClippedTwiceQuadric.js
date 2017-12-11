let ClippedTwiceQuadric = function(surfaceCoeffMatrix, clipperCoeffMatrix, clipperCoeffMatrix2) {
	this.surfaceCoeffMatrix = surfaceCoeffMatrix;
	this.clipperCoeffMatrix = clipperCoeffMatrix;
	this.clipperCoeffMatrix2 = clipperCoeffMatrix2;
};

ClippedTwiceQuadric.prototype.transform = function(T) {
	let inverseT = new Mat4(T).invert();
	let invertTransposeT = new Mat4(T).invert().transpose();
	this.surfaceCoeffMatrix = this.surfaceCoeffMatrix.premul(inverseT).mul(invertTransposeT);
	this.clipperCoeffMatrix = this.clipperCoeffMatrix.premul(inverseT).mul(invertTransposeT);
	this.clipperCoeffMatrix2 = this.clipperCoeffMatrix2.premul(inverseT).mul(invertTransposeT);
};

// ClippedTwiceQuadric.prototype.transformClipper = function(T) {
// 	let inverseT = new Mat4(T).invert();
// 	let invertTransposeT = new Mat4(T).invert().transpose();
// 	this.clipperCoeffMatrix = this.clipperCoeffMatrix.premul(inverseT).mul(invertTransposeT);
// };