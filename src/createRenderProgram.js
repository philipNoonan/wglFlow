/** ---------------------------------------------------------------------
 * Given two shader programs, create a complete rendering program.
 * @param gl WebGLRenderingContext The WebGL context.
 * @param vertexShaderCode String Code for a vertex shader.
 * @param fragmentShaderCode String Code for a fragment shader.
 * @returns WebGLProgram A WebGL shader program object.
 */
//
self.createRenderProgram = function (gl, vertexShaderCode, fragmentShaderCode) {
    // Create the 2 required shaders
    var vertexShader = self.createAndCompileShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
    var fragmentShader = self.createAndCompileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);
    if (!vertexShader || !fragmentShader) {
      return null;
    }
  
    // Create a WebGLProgram object
    var program = gl.createProgram();
    if (!program) {
      out.displayError('Fatal error: Failed to create a program object');
      return null;
    }
  
    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
  
    // Link the WebGLProgram object
    gl.linkProgram(program);
  
    // Check for success
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      // There were errors, so get the errors and display them.
      var error = gl.getProgramInfoLog(program);
      console.log('Fatal error: Failed to link program: ' + error);
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      return null;
    }
  
    // Remember the shaders. This allows for them to be cleanly deleted.
    program.vShader = vertexShader;
    program.fShader = fragmentShader;
  
    return program;
  };