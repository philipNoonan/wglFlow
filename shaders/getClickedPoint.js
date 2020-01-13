const clickedPointSource = `#version 310 es
layout (local_size_x = 1, local_size_y = 1, local_size_z = 1) in;
layout(binding = 0, rgba32f) readonly uniform highp image2D inVertex;

uniform vec2 clickedPoint;

layout(std430, binding = 0) buffer outPosition
{
  vec4 data;
} positionData;

void main()
{
    vec4 clickedVert = imageLoad(inVertex, ivec2(clickedPoint));
    positionData.data = clickedVert;
} 
`;