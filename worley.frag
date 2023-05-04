precision mediump float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform sampler2D tex0;
uniform float time;
uniform float speechiness;

// Adam Mally Worley noise from 4600 homework lol.
vec2 random(vec2 r) {
    return fract(sin(vec2(dot(r, vec2(127.1, 311.7)), dot(r, vec2(269.5, 183.3)))) * 43758.5453);
}

float worley(vec2 tex) {
  tex *= clamp(cos(time * 0.1), 0.43, 0.75);
  float minDist = 1e9;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      vec2 cell = floor(tex) + vec2(float(i), float(j));
      vec2 rnd = fract(sin(vec2(dot(cell, vec2(127.1, 311.7)), dot(cell, vec2(269.5, 183.3)))) * 43758.5453);
      vec2 diff = tex - (cell + rnd);
      float dist = length(diff);
      minDist = min(minDist, dist);
    }
  }

  return minDist;
}

void main() {
  vec2 uv = vTexCoord;

  // Get the texture coordinate from the uniform input
  vec2 tex = texture2D(tex0, uv).xy;

  float worleyNoise = worley(vec2(uv.x * 0.1, uv.y * speechiness));

  vec3 colour = texture2D(tex0, vec2(worleyNoise + uv.x, worleyNoise + uv.y)).rgb;

  gl_FragColor = vec4(colour, 1.0);
}





