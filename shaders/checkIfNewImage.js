const checkIfNewImageSource = `#version 310 es
layout(local_size_x = 1, local_size_y = 1) in;

layout(binding = 0, rgba8ui) readonly uniform highp uimage2D lastImage;
layout(binding = 1, rgba8ui) readonly uniform highp uimage2D nextImage;

layout(std430, binding = 0) buffer outputData
{
    highp uint outData;
};

void main()
{
    ivec2 pix = ivec2(imageSize(lastImage).xy) / 2;

    uint pointA = imageLoad(lastImage, pix).x - imageLoad(nextImage, pix).x;
    uint pointB = imageLoad(lastImage, pix + ivec2(10, 0)).x - imageLoad(nextImage, pix + ivec2(10, 0)).x;
    uint pointC = imageLoad(lastImage, pix + ivec2(5, 10)).x - imageLoad(nextImage, pix + ivec2(5, 10)).x;
    uint pointD = imageLoad(lastImage, pix - ivec2(25, 5)).x - imageLoad(nextImage, pix - ivec2(25, 5)).x;

    outData = (pointA + pointB + pointC + pointC);
}

`;