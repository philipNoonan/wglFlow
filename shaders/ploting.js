const plottingBufferSource = `#version 310 es
layout (local_size_x = 1024, local_size_y = 1, local_size_z = 1) in;

uniform int pingPong;
uniform vec4 newData;

layout(std430, binding = 0) buffer graphXData
{
  vec2 data[];
} graphXOutput;

layout(std430, binding = 1) buffer graphYData
{
  vec2 data[];
} graphYOutput;

layout(std430, binding = 2) buffer graphZData
{
  vec2 data[];
} graphZOutput;

void main()
{
    int idx = int(gl_GlobalInvocationID.x);

    if (pingPong == 0)
    {
        graphXOutput.data[idx + 1].y = graphXOutput.data[idx].x;
        graphYOutput.data[idx + 1].y = graphYOutput.data[idx].x;
        graphZOutput.data[idx + 1].y = graphZOutput.data[idx].x;
    }
    else
    {
        graphXOutput.data[idx + 1].x = graphXOutput.data[idx].y;
        graphYOutput.data[idx + 1].x = graphYOutput.data[idx].y;
        graphZOutput.data[idx + 1].x = graphZOutput.data[idx].y;   
    }

    if (idx == 0)
    {
        if (pingPong == 0)
        {
            graphXOutput.data[idx].y = newData.x;
            graphYOutput.data[idx].y = newData.y;
            graphZOutput.data[idx].y = newData.z;
        }
        else
        {
            graphXOutput.data[idx].x = newData.x;
            graphYOutput.data[idx].x = newData.y;
            graphZOutput.data[idx].x = newData.z;
        }
    }
}
`;

const plottingVertexShaderSource = `#version 310 es

    layout (location = 1) in vec2 vX;
    layout (location = 2) in vec2 vY;
    layout (location = 3) in vec2 vZ;

    uniform int axis;
    uniform vec2 imageSize;

    flat out int axisType;

    void main()
    {
        int idx = gl_VertexID;
        float data = 0.0f;
        if (axis == 0)
        {
            data = vX.x;
        }
        else if (axis == 1)
        {
            data = vY.x;
        }
        else if (axis == 2)
        {
            data = vZ.x;
        }
        gl_Position = vec4((float(idx) / imageSize.x) * 2.0f - 1.0f, 1.0f - (data) * 2.0f, 0, 1);

        gl_PointSize = 1.0;
        axisType = axis;
    }
   `;
   
const plottingFragmentShaderSource = `#version 310 es
    precision mediump float;

    flat in int axisType;
    out vec4 outColor;
    void main()
    {
        if (axisType == 0)
        {
            outColor = vec4(1.0f, 0, 0, 1.0f);
        }
        else if (axisType == 1)
        {
            outColor = vec4(0, 0.5f, 0, 1.0f);
        }
        else if (axisType == 2)
        {
            outColor = vec4(0, 0, 1.0f, 1.0f);
        }

    }
  `;