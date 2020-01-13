/** ---------------------------------------------------------------------
 * Given two shader programs, create a complete rendering program.
 * @param gl WebGLRenderingContext The WebGL context.
 * @param type gl.TEXTURE_2D, gl.TEXTURE_3D etc
 * @param format gl.R32F, gl.RGBA8UI, etc
 * @param levels MIPMAP Levels
 * @param width 
 * @param height 
 * @param depth 
 * @param magFilter gl.NEAREST, gl.LINEAR
 * @param minFilter gl.NEAREST, gl.LINEAR, gl.NEAREST_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_LINEAR
 * @returns WebGLProgram A WebGL texture object.
 */
//
self.generateTexture = function (gl, type, format, levels, width, height, depth, magFilter, minFilter) {

  var texture = gl.createTexture();

  gl.bindTexture(type, texture);

  switch (type) {
    case gl.TEXTURE_1D:
      gl.texStorage1D(type, levels, format, width);
      break;
    case gl.TEXTURE_2D:
    gl.texStorage2D(type, levels, format, width, height);
    break;
    case gl.TEXTURE_3D:
      gl.texStorage3D(type, levels, format, width, height, depth);
      gl.texParameteri(type, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

    break;
    default:
      out.displayError("Invalid type of shader in createAndCompileShader()");
    return null;
  }

  gl.texParameteri(type, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(type, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, magFilter);
  gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, minFilter);
  
    return texture;
  };