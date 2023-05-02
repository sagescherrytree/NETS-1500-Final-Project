#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform int u_Time;

varying vec2 vTexCoord;
uniform sampler2D u_RenderedTexture;

// Determines how many cells there are
#define NUM_CELLS 16.0

// ShaderToy Worley Noise
// Arbitrary random, can be replaced with a function of your choice
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// Returns the point in a given cell
vec2 get_cell_point(ivec2 cell) {
	vec2 cell_base = vec2(cell) / NUM_CELLS;
	float noise_x = rand(vec2(cell));
    float noise_y = rand(vec2(cell.yx));
    return cell_base + (0.5 + 1.5 * vec2(noise_x, noise_y)) / NUM_CELLS;
}

// Performs worley noise by checking all adjacent cells
// and comparing the distance to their points
float worley(vec2 coord) {
    ivec2 cell = ivec2(coord * NUM_CELLS);
    float dist = 1.0;
    
    // Search in the surrounding 5x5 cell block
    for (int x = 0; x < 5; x++) { 
        for (int y = 0; y < 5; y++) {
        	vec2 cell_point = get_cell_point(cell + ivec2(x-2, y-2));
            dist = min(dist, distance(cell_point, coord));

        }
    }
    
    dist /= length(vec2(1.0 / NUM_CELLS));
    dist = 1.0 - dist;
    return dist;
}

// Adam Mally Worley noise
vec2 random(vec2 r) {
    return fract(sin(vec2(dot(r, vec2(127.1, 311.7)), dot(r, vec2(269.5, 183.3)))) * 43758.5453);
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

void main()
{
	vec2 uv = vec2(vTexCoord);
    uv.y *= iResolution.y / iResolution.x;
    vec3 colour = texture2D(u_Texture, worley(uv)).rgb;
	gl_FragColor = vec4(colour);
}