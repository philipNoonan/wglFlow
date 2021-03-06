const edgeDetectSource = `#version 310 es
layout(local_size_x = 32, local_size_y = 32) in;

float luminance(vec3 color)
{
  return (0.299f * float(color.x) + 0.587f * float(color.y) + 0.114f * float(color.z));
}

uniform float lesser;
uniform float upper;
uniform int level;
uniform float normVal;

layout(binding = 0) uniform highp sampler2D colorMap;

layout(binding = 1, rgba32f) writeonly uniform highp image2D gradientMap;
layout(binding = 2, rgba32f) writeonly uniform highp image2D srcTex;

void main()
{
  ivec2 pix = ivec2(gl_GlobalInvocationID).xy;
  
	/*
	image kernel layout
	| a02 a12 a22 |
	| a01 a11 a21 |
	| a00 a10 a20 |
	dx
	| lw 0 -lw |
	| hg 0 -hg |
	| lw 0 -lw |
	dy
	| -lw -hg -lw |
	|  0   0   0  |
	|  lw  hg  lw |
  */
  

	float a00 = luminance(texelFetch(colorMap, ivec2(pix.x - 1, pix.y - 1), level).xyz);
	float a10 = luminance(texelFetch(colorMap, ivec2(pix.x    , pix.y - 1), level).xyz);
	float a20 = luminance(texelFetch(colorMap, ivec2(pix.x - 1, pix.y + 1), level).xyz);

	float a01 = luminance(texelFetch(colorMap, ivec2(pix.x - 1, pix.y    ), level).xyz);
	float a21 = luminance(texelFetch(colorMap, ivec2(pix.x + 1, pix.y    ), level).xyz);

	float a02 = luminance(texelFetch(colorMap, ivec2(pix.x + 1, pix.y - 1), level).xyz);
	float a12 = luminance(texelFetch(colorMap, ivec2(pix.x    , pix.y + 1), level).xyz);
	float a22 = luminance(texelFetch(colorMap, ivec2(pix.x + 1, pix.y + 1), level).xyz);

	float sx = (lesser * a00 + upper * a01 + lesser * a02)
			  -(lesser * a20 + upper * a21 + lesser * a22);

	float sy = (lesser * a00 + upper * a10 + lesser * a20)
			  -(lesser * a02 + upper * a12 + lesser * a22);

	imageStore(gradientMap, ivec2(gl_GlobalInvocationID.xy), vec4(sx * normVal, sy * normVal, 0, 0));
	imageStore(srcTex, ivec2(gl_GlobalInvocationID.xy), vec4(luminance(texelFetch(colorMap, ivec2(pix.x, pix.y), level).xyz), 0, 0, 0));

}
`;