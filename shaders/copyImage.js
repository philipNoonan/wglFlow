const copyImageSource = `#version 310 es
layout(local_size_x = 32, local_size_y = 32) in;

uniform int imageType;

layout(binding = 0, rgba8ui) writeonly uniform highp uimage2D uoutputMap;
layout(binding = 1, rgba8ui) readonly uniform highp uimage2D uinputMap;

layout(binding = 2, rgba32f) writeonly uniform highp image2D outputMap;
layout(binding = 3, rgba32f) readonly uniform highp image2D inputMap;

layout(binding = 4, r32f) writeonly uniform highp image2D routputMap;
layout(binding = 5, r32f) readonly uniform highp image2D rinputMap;

void main()
{
  ivec2 pix = ivec2(gl_GlobalInvocationID).xy;
  if (imageType == 0)
  {
	uvec4 data = imageLoad(uinputMap, pix);
	imageStore(uoutputMap, pix, data);
  }
  else if (imageType == 1)
  {
	vec4 data = imageLoad(inputMap, pix);
	imageStore(outputMap, pix, data);
  }
  else if (imageType == 2)
  {
	vec4 data = imageLoad(rinputMap, pix);
	imageStore(routputMap, pix, data);
  }
}
`;

const genMipMapSource = `#version 310 es
layout(local_size_x = 8, local_size_y = 8) in;

uniform int imageType;
uniform int numberOfLevels;

layout(binding = 0, rgba8ui) writeonly uniform highp uimage2D uoutputMap;
layout(binding = 1, rgba8ui) readonly uniform highp uimage2D uinputMap;

layout(binding = 2, rgba32f) writeonly uniform highp image2D outputMap;
layout(binding = 3, rgba32f) readonly uniform highp image2D inputMap;

layout(binding = 4, r32f) writeonly uniform highp image2D routputMap;
layout(binding = 5, r32f) readonly uniform highp image2D rinputMap;

void main()
{
  ivec2 writePix = ivec2(gl_GlobalInvocationID).xy;
  ivec2 readPixBase = writePix * 2;

  if (imageType == 0)
  {
    uvec4 data = imageLoad(uinputMap, readPixBase) + 
                  imageLoad(uinputMap, readPixBase + ivec2(0, 1)) +
                  imageLoad(uinputMap, readPixBase + ivec2(1, 0)) +
                  imageLoad(uinputMap, readPixBase + ivec2(1, 1));

    imageStore(uoutputMap, writePix, uvec4((vec4(data) / 4.0f) + 0.5f));
  }
  else if (imageType == 1)
  {
    vec4 data = imageLoad(inputMap, readPixBase) + 
                 imageLoad(inputMap, readPixBase + ivec2(0, 1)) +
                 imageLoad(inputMap, readPixBase + ivec2(1, 0)) +
                 imageLoad(inputMap, readPixBase + ivec2(1, 1));

    imageStore(outputMap, writePix, data / 4.0f);
  }
  else if (imageType == 2)
  {
    vec4 data = imageLoad(rinputMap, readPixBase) + 
                imageLoad(rinputMap, readPixBase + ivec2(0, 1)) +
                imageLoad(rinputMap, readPixBase + ivec2(1, 0)) +
                imageLoad(rinputMap, readPixBase + ivec2(1, 1));

    imageStore(routputMap, writePix, data / 4.0f);
  }
}
`;