"use strict"; 
let Material = function(gl, program) { 
  this.gl = gl; 
  this.program = program; 
  let theMaterial = this; 
  Object.keys(program.uniforms).forEach(function(uniformName) { 
    let uniform = program.uniforms[uniformName]; 
    let reflectionVariable = 
        UniformReflectionFactories.makeVar(
            gl, uniform.type, uniform.size, uniform.textureUnit); 
    if(!Material[uniformName]) { 
      Object.defineProperty(theMaterial, uniformName, { value: reflectionVariable} );
    }
  }); 

  return new Proxy(this, { 
    get : function(target, name){ 
      if(!(name in target)){ 
        console.error(
  "WARNING: Ignoring attempt to access material property '" + 
            name + "'. Is '" + name + "' an unused uniform?" ); 
        return Material.dummy; 
      } 
      return target[name]; 
    }, 
  }); 
};




Material.prototype.commit = function() { 
  let gl = this.gl; 
  this.program.commit(); 
  let theMaterial = this; 
  Object.keys(this.program.uniforms).forEach( function(uniformName) { 
    let uniform = theMaterial.program.uniforms[uniformName];
    let reflectionVariable = Material[uniformName] || theMaterial[uniformName];
    reflectionVariable.commit(gl, uniform.location);
  }); 
}; 


 // absorbs all function calls and property accesses without effect
Material.dummy = new Proxy(new Function(), { 
  get: function(target, name){ 
    return Material.dummy; 
  }, 
  apply: function(target, thisArg, args){ 
    return Material.dummy; 
  }, 
}); 

Object.defineProperty(Material,
 "modelMatrix", {value: new Mat4()} );

Object.defineProperty(Material,
 "modelViewProjMatrix", {value: new Mat4()} );

Object.defineProperty(Material,
 "modelMatrixInverse", {value: new Mat4()} );

Object.defineProperty(Material,
 "lightDirection", {value: new Vec3()} );

Object.defineProperty(Material,
 "lightPos", {value: new Vec4Array(2)} );

Object.defineProperty(Material,
 "lightPowerDensity", {value: new Vec3Array(2)} );

Object.defineProperty(Material,
 "spotDir", {value: new Vec3Array(2)} );




