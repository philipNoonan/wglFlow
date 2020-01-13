/** ---------------------------------------------------------------------
 * Create and compile an individual shader.
 * @param gl WebGLRenderingContext The WebGL context.
 * @param type Number The type of shader, either gl.VERTEX_SHADER, gl.FRAGMENT_SHADER, or gl.COMPUTE_SHADER
 * @param source String The code/text of the shader
 * @returns WebGLShader A WebGL shader program object.
 */
self.createAndCompileShader = function (gl, type, source) {
    var typeName;
    switch (type) {
      case gl.VERTEX_SHADER:
        typeName = "Vertex Shader";
        break;
      case gl.FRAGMENT_SHADER:
        typeName = "Fragment Shader";
        break;
        case gl.COMPUTE_SHADER:
            typeName = "Compute Shader";
        break;
      default:
        console.log("Invalid type of shader in createAndCompileShader()");
        return null;
    }
  
    // Create shader object
    var shader = gl.createShader(type);
    if (!shader) {
      console.log("Fatal error: gl could not create a shader object.");
      return null;
    }
  
    // Put the source code into the gl shader object
    gl.shaderSource(shader, source);
  
    // Compile the shader code
    gl.compileShader(shader);
  
    // Check for any compiler errors
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      // There are errors, so display them
      var errors = gl.getShaderInfoLog(shader);
      console.log('Failed to compile ' + typeName + ' with these errors:' + errors);
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
  };