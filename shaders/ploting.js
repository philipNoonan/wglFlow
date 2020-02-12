const plottingBufferSource = `#version 310 es
layout (local_size_x = 1024, local_size_y = 1, local_size_z = 1) in;

uniform int pingPong;
uniform float newData;

layout(std430, binding = 0) buffer graphXData
{
  vec2 data[];
} graphXOutput;


void main()
{
    int idx = int(gl_GlobalInvocationID.x);

    if (pingPong == 0)
    {
        graphXOutput.data[idx + 1].y = graphXOutput.data[idx].x;
    }
    else
    {
        graphXOutput.data[idx + 1].x = graphXOutput.data[idx].y;
    }

    if (idx == 0)
    {
        if (pingPong == 0)
        {
            graphXOutput.data[idx].y = newData;
        }
        else
        {
            graphXOutput.data[idx].x = newData;
        }
    }
}
`;

const plottingVertexShaderSource = `#version 310 es

    layout (location = 0) in vec2 vX;
    layout (location = 1) in vec2 vY;

    uniform int axis;
    flat out int axisType;

    uniform vec2 imageSize;
    uniform vec2 minmax;

    void main()
    {
        int idx = gl_VertexID;
        if (axis == 0) {
            float data = smoothstep(minmax.x, minmax.y, log(length(vY)) / (1024.0f) );
            gl_Position = vec4((float(idx * 2) / imageSize.x) * 2.0f - 1.0f, 1.0f - (1.0f - data) * 2.0f, 0, 1);
            
            // float data = smoothstep(minmax.x, minmax.y, vY.x);
            // gl_Position = vec4((float(idx) / imageSize.x) * 2.0f - 1.0f, 1.0f - (data) * 2.0f, 0, 1);
        
        }
        else if (axis == 1) {
            float data = smoothstep(minmax.x, minmax.y, vX.x);
            gl_Position = vec4((float(idx) / imageSize.x) * 2.0f - 1.0f, 1.0f - (data) * 2.0f, 0, 1);
        }

        axisType = axis;
        gl_PointSize = 5.0;
    }
   `;
   
const plottingFragmentShaderSource = `#version 310 es
    precision mediump float;


    flat in int axisType;
    out vec4 outColor;
    void main()
    {
        if (axisType == 0) {
            outColor = vec4(0, 0, 1.0f, 1.0f);
        }
        else if (axisType == 1) {
            outColor = vec4(0, 0.5f, 0.0f, 1.0f);
        }

    }
  `;