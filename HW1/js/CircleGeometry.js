"use strict";
let CircleGeometry = function(gl) {
  this.gl = gl;

  // vertex buffer
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

  this.size = 123;
  
  let vertices = new Float32Array(this.size);
  let radius = .09;
  let phi = 0;
  vertices[0] = 0; vertices[1] = 0; vertices[2] = .5; // center vertex
  for (var i = 3; i < vertices.length; i+=3) {
    // outer circle
    vertices[i+0] = radius * Math.cos(phi)
    vertices[i+1] = radius * Math.sin(phi)
    vertices[i+2] = 0.5; // z index

    phi += (2 * Math.PI / 21);
  }
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // index buffer
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);


  let indices = new Uint16Array(this.size-3);
  let round = 1;
  for (var i = 0; i < indices.length; i+=3) {
    indices[i] = 0
    indices[i + 1] = round;
    indices[i + 2] = round + 1;
    round++;
  }
  indices[this.size-4] = 1;

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  // color buffer for color gradient
  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

  let colors = new Float32Array(this.size);

  colors[0] = 231/255;
  colors[1] = 76/255;
  colors[2] = 60/255;
  for (var i = 3; i < colors.length; i+=3) {
    colors[i + 0] = 230/255;
    colors[i + 1] = 126/255;
    colors[i + 2] = 34/255;
  }

  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~

};


CircleGeometry.prototype.draw = function() {
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

  // ADDED
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );


  // set index buffer to pipeline input
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  // set index buffer to pipeline input
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.colorBuffer); // ADDED

  gl.drawElements(gl.TRIANGLES, this.size-3, gl.UNSIGNED_SHORT, 0);
};
