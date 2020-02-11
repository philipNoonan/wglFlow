  function uploadGraphPoints(gl, _x) {

    gl.useProgram(plottingBufferProgram);



    gl.uniform1f(gl.getUniformLocation(plottingBufferProgram, "newData"), _x);
    gl.uniform1i(gl.getUniformLocation(plottingBufferProgram, "pingPong"), frameCounter % 2);

    gl.bindBufferBase(gl.SHADER_STORAGE_BUFFER, 0, gl.ssboGraphX);

    gl.dispatchCompute(1, 1, 1);
    gl.memoryBarrier(gl.SHADER_IMAGE_ACCESS_BARRIER_BIT);
  }

function render(gl, width, height, rmax, rmin) {

  gl.viewport(0, 0, width, 240);

    gl.useProgram(renderPlottingProgram);
    gl.bindVertexArray(gl.vaoPlotting);

    gl.uniform2fv(gl.getUniformLocation(renderPlottingProgram, "imageSize"), [1024.0, 240.0]);
    gl.uniform2fv(gl.getUniformLocation(renderPlottingProgram, "minmax"), [rmin, rmax]);

    gl.drawArrays(gl.POINTS, 0, 1024);
    gl.bindVertexArray(null);

     gl.viewport(0, 240, width / 2.0, height - 240);

	 gl.useProgram(renderProgram);
     gl.bindVertexArray(gl.vaoRender);

    let renderOpts = 1 << 0 | 
                       0 << 1 |
                       0 << 2 |
                       0 << 3 |
                       0 << 4 |
                       0 << 5;

    gl.uniform1i(gl.getUniformLocation(renderProgram, "renderOptions"), renderOpts);
    gl.uniform2fv(gl.getUniformLocation(renderProgram, "imageSize"), [imageSize[0] >> gl.rndrLevel, imageSize[1] >> gl.rndrLevel]);

    gl.uniform1i(gl.getUniformLocation(renderProgram, "renderLevel"), gl.rndrLevel);


    gl.uniform1i(gl.getUniformLocation(renderProgram, "maskMap"), 0);
    gl.uniform1i(gl.getUniformLocation(renderProgram, "lastColorTex"), 1);
    gl.uniform1i(gl.getUniformLocation(renderProgram, "gradTex"), 2);
    gl.uniform1i(gl.getUniformLocation(renderProgram, "flowTex"), 3);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gl.mask_texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, gl.color_texture);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, gl.gradient_texture);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, gl.sparseFlow_texture);




    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertex_buffer);
    gl.vertexAttribPointer(gl.vertex_location, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.index_buffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  

    gl.viewport(width / 2.0, 240, width / 2.0, height - 240);

    renderOpts = 0 << 0 | 
                       0 << 1 |
                       1 << 2 |
                       0 << 3 |
                       0 << 4 |
                       1 << 5;

    gl.uniform1i(gl.getUniformLocation(renderProgram, "renderOptions"), renderOpts);
    gl.uniform2fv(gl.getUniformLocation(renderProgram, "imageSize"), [imageSize[0] >> gl.rndrLevel, imageSize[1] >> gl.rndrLevel]);
    gl.uniform1i(gl.getUniformLocation(renderProgram, "renderLevel"), gl.rndrLevel);

    gl.uniform1i(gl.getUniformLocation(renderProgram, "maskMap"), 0);
    gl.uniform1i(gl.getUniformLocation(renderProgram, "lastColorTex"), 1);
    gl.uniform1i(gl.getUniformLocation(renderProgram, "gradTex"), 2);
    gl.uniform1i(gl.getUniformLocation(renderProgram, "flowTex"), 3);
    gl.uniform1i(gl.getUniformLocation(renderProgram, "dstTex"), 4);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gl.mask_texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, gl.color_texture);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, gl.gradient_texture);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, gl.densify_texture);
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, gl.srcTex);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertex_buffer);
    gl.vertexAttribPointer(gl.vertex_location, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.index_buffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(null);

}