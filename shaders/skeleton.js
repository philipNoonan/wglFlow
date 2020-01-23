const skeletonVertexShaderSource = `#version 310 es
    layout (location = 0) in vec2 pos;

    uniform vec2 imageSize;

    void main()
    {
        gl_Position = vec4((pos.x / imageSize.x) * 2.0f - 1.0f, 1.0f - (pos.y / imageSize.y) * 2.0f, 0, 1);
        gl_PointSize = 10.0f;
    }
   `;
   
const skeletonFragmentShaderSource = `#version 310 es
    precision highp float;

    out vec4 outColor;
    void main()
    {
        outColor = vec4(0.0f, 1.0, 0.0f, 1.0f);
    }
  `;