const checkIfNewImageSource = `#version 310 es
layout(local_size_x = 1, local_size_y = 1) in;

layout(binding = 0) uniform highp usampler2D lastImage;
layout(binding = 1) uniform highp usampler2D nextImage;

layout(std430, binding = 0) buffer outputData
{
    highp uint outData;
};

void main()
{
    ivec2 pix = ivec2(textureSize(lastImage, 0).xy) / 2;

    uint pointA = texelFetch(lastImage, pix, 0).x - texelFetch(nextImage, pix, 0).x;
    uint pointB = texelFetch(lastImage, pix + ivec2(10, 0), 0).x - texelFetch(nextImage, pix + ivec2(10, 0), 0).x;
    uint pointC = texelFetch(lastImage, pix + ivec2(5, 10), 0).x - texelFetch(nextImage, pix + ivec2(5, 10), 0).x;
    uint pointD = texelFetch(lastImage, pix - ivec2(25, 5), 0).x - texelFetch(nextImage, pix - ivec2(25, 5), 0).x;
    uint pointE = texelFetch(lastImage, pix + ivec2(45, 45), 0).x - texelFetch(nextImage, pix + ivec2(45, 45), 0).x;
    uint pointF = texelFetch(lastImage, pix - ivec2(73, 25), 0).x - texelFetch(nextImage, pix - ivec2(73, 25), 0).x;
    uint pointG = texelFetch(lastImage, pix + ivec2(100, 100), 0).x - texelFetch(nextImage, pix + ivec2(100, 100), 0).x;
    uint pointH = texelFetch(lastImage, pix - ivec2(100, 100), 0).x - texelFetch(nextImage, pix - ivec2(100, 100), 0).x;

    outData = (pointA + pointB + pointC + pointD + pointE + pointF + pointG + pointH);
}

`;