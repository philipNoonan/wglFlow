const fftSource = `#version 310 es
// https://community.khronos.org/t/spectrogram-and-fft-using-opengl/76933/13
// not optimised at all, but a start ....
// now trying https://www.shadertoy.com/view/MscGWS#


layout(local_size_x = 16, local_size_y = 16) in;

layout(rgba32f, binding=0) readonly highp uniform image2D grid_in;
layout(rgba32f, binding=1) writeonly highp uniform image2D grid_out;

float tau = atan(1.0f)*8.0f;

uniform int hori;

vec2 polar(float m, float a)
{
	return m*vec2(cos(a), sin(a));   
}

const float pi = 3.141592653589793f;

vec2 cmul(vec2 a, vec2 b)
{
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 horizontalPass(in ivec2 ij) 
{
    ivec2 imSize = ivec2(imageSize(grid_in).xy);

    float w = float(ij.x - imSize.x/2);
    vec2 xw = vec2(0.0f);

    for(int n = 0; n < imSize.x; n++)
    {
        float a = -(tau * w * float(n)) / float(imSize.x);
        vec2 xn = imageLoad(grid_in, ivec2(n, ij.y)).xy;
        xw += cmul(xn, polar(1.0f, a));
    }

    return xw;
}

vec2 verticalPass(in ivec2 ij) 
{
    ivec2 imSize = ivec2(imageSize(grid_in).xy);

    float w = float(ij.y - imSize.x/2);
    vec2 xw = vec2(0.0f);

    for(int n = 0; n < imSize.x; n++)
    {
        float a = -(tau * w * float(n)) / float(imSize.x);
        vec2 xn = imageLoad(grid_in, ivec2(ij.x, n)).xy;
        xw += cmul(xn, polar(1.0f, a));
    }

    return xw;
}

void main()
{
    ivec2 uv = ivec2(gl_GlobalInvocationID.xy);

    vec2 outData;
    if (hori == 1)
    {
        outData = horizontalPass(uv);
    }
    else
    {
        outData = verticalPass(uv);
    }

    imageStore(grid_out, uv, vec4(outData, 0, 0));
}

`;