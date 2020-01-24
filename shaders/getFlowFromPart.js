const getFlowFromPartSource = `#version 310 es
layout(local_size_x = 112, local_size_y = 1) in;

layout(binding = 0, rgba32f) readonly uniform highp image2D flowMap;
layout(binding = 1, r32i) readonly uniform highp iimage2D maskMap;

layout(std430, binding = 0) buffer OutputData
{
  float data[];
} outputData;

shared float S[112][2];


void main()
{
    uint sline = gl_LocalInvocationID.x; // 0 - 111
	uvec2 imSize = uvec2(imageSize(flowMap).xy);

    float sums[2];

    for (int i = 0; i < 2; ++i)
    {
        sums[i] = 0.0f;
	}
	
	for (uint y = gl_WorkGroupID.x; y < imSize.y; y += gl_NumWorkGroups.x)
    {
      for (uint x = sline; x < imSize.x; x += gl_WorkGroupSize.x)
      {
		int partID = imageLoad(maskMap, ivec2(x, y)).x;
		if (partID == 12)
		{
			vec2 flow = imageLoad(flowMap, ivec2(x, y)).xy;
			sums[0] += flow.x;
			sums[1] += flow.y;
		}
		else
		{
			continue;
		}
	  }
    }
    
	for (int i = 0; i < 2; ++i)
    {
        S[sline][i] = sums[i];
    }    

    barrier(); // wait for threads to finish

    if (sline < 2u)
    {
        for (uint i = 1u; i < gl_WorkGroupSize.x; ++i)
        {
            S[0][sline] += S[i][sline];
        }
        outputData.data[sline + gl_WorkGroupID.x * 2u] = S[0][sline];
    }
}
`;