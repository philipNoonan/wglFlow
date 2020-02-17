const vertexShaderSource = `#version 310 es
    in vec2 v;
    out vec2 t;
    out vec2 t_image;
    uniform vec2 imageSize;

    void main(){
        gl_Position = vec4(v.x * 2.0 - 1.0, 1.0 - v.y * 2.0, 0, 1);
        t = v;
        t_image = v * imageSize;
    }
   `;
   
const fragmentShaderSource = `#version 310 es
    precision highp float;

    layout(binding = 0) uniform highp sampler2D maskMap;
    layout(binding = 1) uniform highp sampler2D lastColorTex;
    layout(binding = 2) uniform highp sampler2D gradTex;
    layout(binding = 3) uniform highp sampler2D flowTex;
    layout(binding = 4) uniform highp sampler2D dstTex;
    layout(binding = 5) uniform highp sampler2D depthTex;

    uniform int renderLevel;

    float pi = atan(1.0f)*4.0f;
    float tau = atan(1.0f)*8.0f;

    const vec3 maskColors[24] = vec3[](
        vec3(110, 64, 170), vec3(143, 61, 178), vec3(178, 60, 178), vec3(210, 62, 167),
        vec3(238, 67, 149), vec3(255, 78, 125), vec3(255, 94, 99),  vec3(255, 115, 75),
        vec3(255, 140, 56), vec3(239, 167, 47), vec3(217, 194, 49), vec3(194, 219, 64),
        vec3(175, 240, 91), vec3(135, 245, 87), vec3(96, 247, 96),  vec3(64, 243, 115),
        vec3(40, 234, 141), vec3(28, 219, 169), vec3(26, 199, 194), vec3(33, 176, 213),
        vec3(47, 150, 224), vec3(65, 125, 224), vec3(84, 101, 214), vec3(99, 81, 195));

    vec3 rainbow(float x)
    {
        vec3 col = vec3(0);
        col.r = cos(x * tau - (0.0f/3.0f)*tau);
        col.g = cos(x * tau - (1.0f/3.0f)*tau);
        col.b = cos(x * tau - (2.0f/3.0f)*tau);
        
        return col * 0.5f + 0.5f;
    }


    uniform int renderOptions;
    in vec2 t;
    in vec2 t_image;
    out vec4 outColor;

    vec3 flowToRGB(vec2 flow, float scale)
    {
        float mag = sqrt(flow.x * flow.x + flow.y * flow.y);
        float ang = atan(flow.y,  flow.x);
        //https://gist.github.com/KeyMaster-/70c13961a6ed65b6677d
        ang -= 1.57079632679;
        if(ang < 0.0) 
        {
            ang += 6.28318530718; 
        }
        ang /= 6.28318530718; 
        ang = 1.0 - ang; 
        // ang to rgb taken from https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(ang + K.xyz) * 6.0 - K.www);
        vec3 rgb = mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), mag * scale);

        return rgb;
    }

    void main(){
    
    int renderColor = (renderOptions & 1);
    int renderDepth = (renderOptions & 2) >> 1;
    int renderFlow = (renderOptions & 4) >> 2;
    int renderGrad = (renderOptions & 8) >> 3;
    int renderFreq = (renderOptions & 16) >> 4;
    int renderMask = (renderOptions & 32) >> 5;


    if (renderColor == 1)
    {
        vec4 mask = vec4(texture(maskMap, t));
        
        vec4 col = vec4(texelFetch(lastColorTex, ivec2(t_image), renderLevel));

        vec4 lastcol = vec4(texelFetch(lastColorTex, ivec2(t * vec2(textureSize(lastColorTex, 4).xy)), 4));

        outColor = vec4(col.xyz, 1.0f);
        if (mask.x == 12.0f)
        {
            vec4 tFlow = vec4(texture(flowTex, t, float(renderLevel)));
        
            float scale = 50.0f;
            vec3 rgb = flowToRGB(tFlow.xy, scale);

            outColor = vec4(mix(1.0f - rgb, outColor.xyz, 0.5f), 1.0f);
        }
        else if (mask.x == 0.0f || mask.x == 1.0f)
        {
            //lastcol = vec4(imageLoad(blurredColorMap, ivec2(t * vec2(imageSize(blurredColorMap).xy) + 0.5f)));
            outColor = vec4(lastcol.xyz, 1.0f);
        }


    }

    if (renderGrad == 1)
    {
        vec4 col = vec4(texture(gradTex, t, float(renderLevel)));

        outColor = vec4(abs(col.xy) * 10.0f, 0.0f, 1.0f);
    }

    if (renderFlow == 1)
    {
        vec4 tFlow = vec4(texture(flowTex, t, float(renderLevel)));
        float scale = 10.0f;
        vec3 rgb = flowToRGB(tFlow.xy, scale);

        outColor = vec4(1.0f - rgb, 1.0f);
        

    }

    if (renderFreq == 1)
    {

        //ivec2 pix = ivec2(mod(floor(t_image)-vec2(17*17,0)+(17.0f*17.0f),vec2(17*17)));
        //vec4 tempFFT = vec4(texelFetch(dstTex, pix, 0));

        vec4 tempFFT = vec4(texture(dstTex, t));
        //outColor = vec4(log(length(tempFFT.xy)) / log(480.0f*480.0f), 0, 0, 1);
        //outColor = vec4(log((tempFFT.xy)), 0, 1);
        //outColor = vec4(log(length(tempFFT.xy)) / log(480.0f*480.0f), 0, 0, 1);
        //outColor = vec4(length(tempFFT.xy) / 480.0f, 0, 0, 1);
        outColor = vec4(tempFFT.xy * 20.0f, 0, 1);
        //outColor = vec4(rainbow(atan(tempFFT.y,tempFFT.x) / pi + 0.5f), 1);        
        //outColor = vec4((tempFFT.xy / 480.0f) * 0.5f + 0.5f, 0.0, 1);        

    }

    if (renderDepth == 1)
    {
        vec4 col = vec4(texture(depthTex, t, float(renderLevel)));

        outColor = vec4(col.xxx * 10.0f, 1.0f);
    }

    if (renderMask == 1)
    {
        //outColor = vec4(0, 0, 0, 1);
        vec4 mask = vec4(texture(maskMap, t));


        outColor = vec4(maskColors[int(mask.x)] / 255.0f, 1);

    }
}
`;