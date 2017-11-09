"use strict";
let TexturedIndexedTrianglesGeometry = function(gl, jsonObject) { 
  this.gl = gl; 
  this.jsonObject = jsonObject;

  // vertex buffer 
  this.vertexBuffer = gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.jsonObject.vertices), gl.STATIC_DRAW);

  // index buffer
  var indices = [].concat.apply([], jsonObject.faces);
  this.indicesLenth = indices.length;
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  // very similar to the vertexColor attribute, just different name
  this.vertexNormalBuffer = gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.jsonObject.normals), gl.STATIC_DRAW);

  // new attribute buffer, with 2 floats per vertex
  this.vertexTexCoordBuffer = gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.jsonObject.texturecoords[0]), gl.STATIC_DRAW);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~

};


TexturedIndexedTrianglesGeometry.prototype.draw = function() {
  let gl = this.gl;
  // set vertex buffer to pipeline input
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer); 
  gl.enableVertexAttribArray(1); 
  gl.vertexAttribPointer(1, 
    3, gl.FLOAT, //< three pieces of float 
    false, //< do not normalize (make unit length) 
    0, //< tightly packed 
    0 //< data starts at array start 
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer); 
  gl.enableVertexAttribArray(2); 
  gl.vertexAttribPointer(2, 
    2, gl.FLOAT, //< two pieces of float 
    false, //< do not normalize (make unit length) 
    0, //< tightly packed 
    0 //< data starts at array start 
  ); 



  // set index buffer to pipeline input 
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer); 
  
  gl.drawElements(gl.TRIANGLES, this.indicesLenth, gl.UNSIGNED_SHORT, 0);
};
