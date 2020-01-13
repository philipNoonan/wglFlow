/** ---------------------------------------------------------------------
 * Given two shader programs, create a complete rendering program.
 * @param gl WebGLRenderingContext The WebGL context.
 * @param computeShaderCode String Code for a compute shader.
 * @returns WebGLProgram A WebGL shader program object.
 */
//
self.createComputeProgram = function (gl, computeShaderCode) {
    // Create the required shader
    var computeShader = self.createAndCompileShader(gl, gl.COMPUTE_SHADER, computeShaderCode);
    if (!computeShader) {
      return null;
    }
  
    // Create a WebGLProgram object
    var program = gl.createProgram();
    if (!program) {
      out.displayError('Fatal error: Failed to create a program object');
      return null;
    }
  
    // Attach the shader objects
    gl.attachShader(program, computeShader);
  
    // Link the WebGLProgram object
    gl.linkProgram(program);
  
    // Check for success
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      // There were errors, so get the errors and display them.
      var error = gl.getProgramInfoLog(program);
      out.displayError('Fatal error: Failed to link program: ' + error);
      gl.deleteProgram(program);
      gl.deleteShader(computeShader);
      return null;
    }
  
    return program;
  };