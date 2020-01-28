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

    layout(binding = 0) uniform highp isampler2D colorMap;
    // layout(binding = 1) uniform highp sampler2D lastColorMap;

    //layout(binding = 0, r32f) readonly uniform highp image2D colorMap;
    layout(binding = 1, rgba8ui) readonly uniform highp uimage2D lastColorMap;

    layout(binding = 2, rgba32f) readonly uniform highp image2D gradMap;
    layout(binding = 3, rgba32f) readonly uniform highp image2D flowMap;

    uniform int renderOptions;
    in vec2 t;
    in vec2 t_image;
    out vec4 outColor;

    vec3 flowToRGB(vec2 flow)
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
        vec3 rgb = mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), mag * 10.0f);

        return rgb;
    }

    void main(){
    
    int renderColor = (renderOptions & 1);
    int renderGrad = (renderOptions & 2) >> 1;
    int renderFlow = (renderOptions & 4) >> 2;
    int renderRefVert = (renderOptions & 8) >> 3;
    int renderNorm = (renderOptions & 16) >> 4;
    int renderVert = (renderOptions & 32) >> 5;

    if (renderColor == 1)
    {
        vec4 col = vec4(texelFetch(colorMap, ivec2(t_image + 0.5f), 0));

        //vec4 col = vec4(imageLoad(colorMap, ivec2(t_image + 0.5f)));
        vec4 lastcol = vec4(imageLoad(lastColorMap, ivec2(t_image + 0.5f)));

        vec4 tFlow = imageLoad(flowMap, ivec2(t_image + 0.5f));
        
        vec3 rgb = flowToRGB(tFlow.xy);

        //outColor = vec4((col.xyz - lastcol.xyz) / 255.0f, 1.0f);
        //if (t_image.x > 320.0f)
        //{
        //    discard;
        //}
        outColor = vec4(lastcol.xyz / 256.0f, 1.0f);
        if (col.x == 12.0f)
        {
            outColor = vec4(1.0f - rgb, 1.0f);
        }

    }

    if (renderGrad == 1)
    {
        vec4 col = imageLoad(gradMap, ivec2(t_image + 0.5f));
        outColor = vec4(abs(col.xy) * 10.0f, 0.0f, 1.0f);
    }

    if (renderFlow == 1)
    {
        vec4 tFlow = imageLoad(flowMap, ivec2(t_image + 0.5f));
        
        vec3 rgb = flowToRGB(tFlow.xy);

        outColor = vec4((1.0 - rgb), 1.0f);

    }
}
`;