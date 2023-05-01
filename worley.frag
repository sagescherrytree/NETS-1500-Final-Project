#ifdef GL_ES
    precision mediump float;
#endif

uniform vec2 u_Dimensions;
uniform float u_Time;

out vec3 color;

#define NOISE_FREQUENCY 4.0
#define FBM_OCTAVES 6

vec2 random(vec2 r) {
    return fract(sin(vec2(dot(r, vec2(127.1, 311.7)), dot(r, vec2(269.5, 183.3)))) * 43758.5453);

}

float random2( vec2 p ) {
    return fract(sin(dot(p, vec2(324.1, 87.7))) * 24589.5453);
}

float surflet(vec2 P, vec2 gridPoint) {
    // Compute falloff function by converting linear distance to a polynomial
    float distX = abs(P.x - gridPoint.x);
    float distY = abs(P.y - gridPoint.y);
    float tX = 1 - 6 * pow(distX, 5.f) + 15 * pow(distX, 4.f) - 10 * pow(distX, 3.f);
    float tY = 1 - 6 * pow(distY, 5.f) + 15 * pow(distY, 4.f) - 10 * pow(distY, 3.f);
    // Get the random vector for the grid point
    vec2 gradient = 2.f * random(gridPoint) - vec2(1.f);
    // Get the vector from the grid point to P
    vec2 diff = P - gridPoint;
    // Get the value of our height field by dotting grid->P with our gradient
    float height = dot(diff, gradient);
    // Scale our height field (i.e. reduce it) by our polynomial falloff function
    return height * tX * tY;
}

float perlinNoise(vec2 uv) {
        float surfletSum = 0.f;
        // Iterate over the four integer corners surrounding uv
        for(int dx = 0; dx <= 1; ++dx) {
                for(int dy = 0; dy <= 1; ++dy) {
                        surfletSum += surflet(uv, floor(uv) + vec2(dx, dy));
                }
        }
        return surfletSum;
}


float worleyNoise(vec2 uv) {
    uv *= cos(u_Time * 0.1f);
    vec2 uvInt = floor(uv);
    vec2 uvFract = fract(uv);
    float minDist = 1.f; // Max possible dist
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            vec2 neighbour = vec2(float(i), float(j));
            vec2 point = random(uvInt + neighbour);
            vec2 diff = neighbour + point - uvFract;
            float dist = length(diff);
            minDist = min(minDist, dist);
        }
    }
    return minDist;
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy; 

    float x = worleyNoise(uv + vec2(1/u_Dimensions.x, 0)) - worleyNoise(uv - vec2(1/u_Dimensions.x, 0));
    float y = worleyNoise(uv + vec2(1/u_Dimensions.y, 0)) - worleyNoise(uv - vec2(1/u_Dimensions.y, 0));

    float worleyWarp = worleyNoise2(uv * 0.5f) * 2.f;
    float worleyWarp2 = worleyNoise(uv * 0.5f + worleyWarp);

    vec3 nor = vec3(x, y, sqrt(1 - x * x - y * y)) * 0.9f;

    float t = abs(sin(u_Time*0.01));

    // Get a random colour from the scene
    vec3 a = vec3(0.76f, 0.5f, 0.9f);
    vec3 b = vec3(0.65f, 0.23f, 0.97f);
    vec3 c = vec3(0.75f, 0.63f, 0.14f);

    vec3 mixColor = mix(a, b, t);

    gl_FragColor *= vec4(mixColor, 1.f);
}