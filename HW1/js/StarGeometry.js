"use strict";
let StarGeometry = function(gl) {
  this.gl = gl;

  // vertex buffer
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  
  let vertices = new Float32Array(33);
  let inRadius = .05;
  let outRadius = .1;
  let phi = 0;
  vertices[0] = 0; vertices[1] = 0; vertices[2] = .5; // center vertex
  for (var i = 3; i < vertices.length; i+=6) {
    // inner circle
    vertices[i+0] = inRadius * Math.cos(phi)
    vertices[i+1] = inRadius * Math.sin(phi)
    vertices[i+2] = 0.5; // z index

    phi += (2 * Math.PI / 10);

    // outer circle
    vertices[i+3] = outRadius * Math.cos(phi)
    vertices[i+4] = outRadius * Math.sin(phi)
    vertices[i+5] = 0.5; // z index

    phi += (2 * Math.PI / 10);
  }
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // index buffer
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);


  let indices = new Uint16Array(30);
  let round = 1;
  for (var i = 0; i < indices.length; i+=3) {
    indices[i] = 0
    indices[i + 1] = round;
    indices[i + 2] = round + 1;
    round++;
  }
  indices[29] = 1;

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  // color buffer for color gradient
  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

  let colors = new Float32Array(33);

  colors[0] = 0.0;
  colors[1] = 0.5;
  colors[2] = 0.0;
  for (var i = 3; i < colors.length; i+=3) {
    colors[i + 0] = 0.0;
    colors[i + 1] = 0.8;
    colors[i + 2] = 0.0;
  }

  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~

};


StarGeometry.prototype.draw = function() {
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

  gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 0);
};
