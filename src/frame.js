function calcGradient(gl, level, width, height) {


    gl.useProgram(edgeDetectProgram);

    gl.bindImageTexture(0, gl.color_texture, level, false, 0, gl.READ_ONLY, gl.RGBA8UI)
    gl.bindImageTexture(1, gl.gradient_texture, level, false, 0, gl.WRITE_ONLY, gl.RGBA32F)

    // bind uniforms
    let lesser = 3.0;
    let upper = 10.0;
    gl.uniform1f(gl.getUniformLocation(edgeDetectProgram, "lesser"), lesser);
    gl.uniform1f(gl.getUniformLocation(edgeDetectProgram, "upper"), upper);
    gl.uniform1i(gl.getUniformLocation(edgeDetectProgram, "level"), level);
    gl.uniform1f(gl.getUniformLocation(edgeDetectProgram, "normVal"), 1.0 / (2.0 * upper + 4.0 * lesser));

    gl.dispatchCompute(divup(width, 32), divup(height, 32), 1);
    gl.memoryBarrier(gl.SHADER_IMAGE_ACCESS_BARRIER_BIT);

  }

function inverseSearch(gl, level, width, height){

  let invDenseSize = [1.0 / (width >> level), 1.0 / (height >> level)];
  let invPrevDenseSize = [1.0 / (width >> (level + 1)), 1.0 / (height >> (level + 1))];  
  let sparseSize = [(width / 4.0) >> level , (height / 4.0) >> level];

  gl.useProgram(disSearchProgram);
  gl.uniform1f(gl.getUniformLocation(disSearchProgram, "level"), level);
  gl.uniform2fv(gl.getUniformLocation(disSearchProgram, "invImageSize"), invDenseSize);
  gl.uniform2fv(gl.getUniformLocation(disSearchProgram, "invPreviousImageSize"), invPrevDenseSize);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, gl.lastColor_texture);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, gl.color_texture);

  gl.bindImageTexture(0, gl.lastGradient_texture, level, false, 0, gl.READ_ONLY, gl.RGBA32F);
  gl.bindImageTexture(1, gl.densify_texture, level + 1, false, 0, gl.READ_ONLY, gl.RGBA32F);
  gl.bindImageTexture(2, gl.sparseFlow_texture, level, false, 0, gl.WRITE_ONLY, gl.RGBA32F);
  gl.bindImageTexture(3, gl.densify_texture, level, false, 0, gl.WRITE_ONLY, gl.RGBA32F);

  gl.dispatchCompute(divup(sparseSize[0], 32), divup(sparseSize[1], 32), 1);
  gl.memoryBarrier(gl.SHADER_IMAGE_ACCESS_BARRIER_BIT);

}

function densify(gl, level, width, height) {
  
  let sparseSize = [width / 4.0, height / 4.0];
  let invDenseSize = [1.0 / (width >> level), 1.0 / (height >> level)];

  gl.bindFramebuffer(gl.FRAMEBUFFER, gl.frameBuffers[level]);

  //let drawBuffs = [gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1];
  let drawBuffs = [gl.COLOR_ATTACHMENT0];

  gl.disable(gl.DEPTH_TEST);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE);

  gl.viewport(0, 0, width >> level, height >> level);

  gl.useProgram(disDensificationProgram);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, gl.lastColor_texture);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, gl.color_texture);

  gl.uniform1f(gl.getUniformLocation(disDensificationProgram, "level"), level);
  gl.uniform2fv(gl.getUniformLocation(disDensificationProgram, "invDenseTexSize"), invDenseSize);
  gl.uniform2iv(gl.getUniformLocation(disDensificationProgram, "sparseTexSize"), sparseSize);

  gl.bindImageTexture(0, gl.sparseFlow_texture, level, false, 0, gl.READ_ONLY, gl.RGBA32F)

  gl.drawBuffers(drawBuffs);

  let numberOfPatches = sparseSize[0] * sparseSize[1];

  gl.drawArrays(gl.POINTS, 0, numberOfPatches);


  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);


}