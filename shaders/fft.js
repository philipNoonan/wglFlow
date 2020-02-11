const dft2DSource = `#version 310 es
// https://community.khronos.org/t/spectrogram-and-fft-using-opengl/76933/13
// not optimised at all, but a start ....
// now trying https://www.shadertoy.com/view/MscGWS#
// THIS IS DFT!


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


const fft2DSource = `#version 310 es
// https://www.shadertoy.com/view/4dGyWD


layout(local_size_x = 16, local_size_y = 16) in;

layout(rgba32f, binding=0) readonly highp uniform image2D grid_in;
layout(rgba32f, binding=1) writeonly highp uniform image2D grid_out;

float tau = atan(1.0f)*8.0f;

uniform int hori;
uniform int pingpong;

uniform int dir;

uniform int radix;

const float pi = 3.141592653589793f;


#define margin ((floor(R.xy) - vec2(radix * radix * 2, radix * radix)) / 2.0f)
#define W(i,n) cexp(vec2(0, 2.0f * pi * float(i)/float(n)))

vec2 cmul(vec2 a, vec2 b)
{
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 cprod(vec2 a, vec2 b){
    return mat2(a,-a.y,a.x) * b;
}

vec2 cis(float t){
    return cos(t - vec2(0,pi/2.));
}
vec2 cexp(vec2 z) {
    return exp(z.x)*cis(z.y);
}


void horizontalPassFirst(in ivec2 uv) 
{
    if (uv.x > (radix * radix) || uv.y > (radix * radix))
    {
        return;
    }

    vec4 outVec = vec4(0);
    
    vec2 sum = vec2(0.0f);
    int n = dir * uv.x / radix;

    for (int i = 0; i < 32; i++)
    {
        if (i >= radix)
        {
            break;
        }
        ivec2 k = uv;
        k.x = (k.x % radix) + i * radix;
    
        vec2 W = vec2(i * n, radix);

        sum += cprod(imageLoad(grid_in, k).xy,
                     W(i*n, radix) 
                    );
    }      
    
    outVec.xy = sum / float(radix);
    outVec.xy = cprod(outVec.xy, W(dir * (uv.x % radix) * (uv.x / radix), radix * radix));

    imageStore(grid_out, uv, outVec);
    
}

void horizontalPassSecond(in ivec2 uv)
{
    if (uv.x > (radix * radix) || uv.y > (radix * radix))
    {
        return;
    }

    vec4 outVec = vec4(0);
    
    vec2 sum = vec2(0.0f);
    int n = dir * uv.x / radix;

    for (int i = 0; i < 32; i++) 
    {
        if (i >= radix) 
        {
            break;
        }
        ivec2 k = uv;
        k.x = (k.x % radix) * radix + i;
        sum += cprod(imageLoad(grid_in, k).xy,
                     W(i * n, radix)
                     );
    }

    outVec.xy = sum / float(radix);

    imageStore(grid_out, uv, outVec);

}

void verticalPassFirst(in ivec2 uv) 
{
    if (uv.x > (radix * radix) || uv.y > (radix * radix))
    {
        return;
    }

    vec4 outVec = vec4(0);

    vec2 sum = vec2(0);
    int n = dir * uv.y / radix;
    for(int i = 0; i < 32; i++){
        if (i >= radix) 
        {
            break;
        }
        ivec2 k = uv;
        k.y = (k.y % radix ) + i * radix;
        sum += cprod(imageLoad(grid_in, k).xy,
                     W(i * n, radix)
                     );
    }
    
    outVec.xy = sum;
    outVec.xy = cprod(outVec.xy, W(dir * (uv.y % radix) * (uv.y / radix), radix * radix));

    imageStore(grid_out, uv, outVec);
}

void verticalPassSecond(in ivec2 uv) 
{
    if (uv.x > (radix * radix) || uv.y > (radix * radix))
    {
        return;
    }

    vec4 outVec = vec4(0);

    vec2 sum = vec2(0);
    int n = dir * uv.y / radix;

    for(int i = 0; i < 32; i++){
        if (i >= radix) 
        {
            break;
        }
        ivec2 k = uv;
        k.y = (k.y % radix) * radix + i;
        sum += cprod(imageLoad(grid_in, k).xy,
                     W(i * n, radix)
                     );
    }

    outVec.xy = sum;
    imageStore(grid_out, uv, outVec);
}

void main()
{
    ivec2 uv = ivec2(gl_GlobalInvocationID.xy);

    if (hori == 1)
    {
        if (pingpong == 1)
        {
            horizontalPassFirst(uv);
        }
        else
        {
            horizontalPassSecond(uv);
        }
    }
    else
    {
        if (pingpong == 1)
        {
            verticalPassFirst(uv);
        }
        else
        {
            verticalPassSecond(uv);
        }
    }

}

`;