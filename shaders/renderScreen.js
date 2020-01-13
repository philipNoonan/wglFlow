const vertexShaderSource = `#version 310 es
    in vec2 v;
    out vec2 t;
    out vec2 t_image;
    uniform vec2 imageSize;

    void main(){
    gl_Position = vec4(v.x * 2.0 - 1.0, 1.0 - v.y * 2.0, 0, 1);
    t = v;
    t_image = v * imageSize;
    }
   `;
   
const fragmentShaderSource = `#version 310 es
    precision mediump float;

    layout(binding = 0, rgba8ui) readonly uniform mediump uimage2D colorMap;
    layout(binding = 1, rgba32f) readonly uniform mediump image2D gradMap;

    uniform int renderOptions;
    in vec2 t;
    in vec2 t_image;
    out vec4 outColor;
    void main(){
    
    int renderColor = (renderOptions & 1);
    int renderGrad = (renderOptions & 2) >> 1;
    int renderRefNorm = (renderOptions & 4) >> 2;
    int renderRefVert = (renderOptions & 8) >> 3;
    int renderNorm = (renderOptions & 16) >> 4;
    int renderVert = (renderOptions & 32) >> 5;

    if (renderColor == 1)
    {
        vec4 col = vec4(imageLoad(colorMap, ivec2(t_image + 0.5f)));
        outColor = vec4(col.xyz * 0.00390625f, 1.0f);
    }

    if (renderGrad == 1)
    {
        vec4 col = imageLoad(gradMap, ivec2(t_image + 0.5f));
        outColor = vec4(abs(col.xy) * 10.0f, 0.0f, 1.0f);
    }

  }
  `;