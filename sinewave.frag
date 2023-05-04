precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform float time;
uniform float frequency;
uniform float amplitude;

void main() {

  vec2 uv = vTexCoord;
  uv = 1.0 - uv;
  
  
  float sineWave = sin(uv.y * frequency + time) * amplitude * 0.1;
  float sineWave2 = cos(uv.x * frequency * 1.5 + time) * amplitude * 0.5;

  //vec2 distort = vec2(sineWave, sineWave2);
  
  vec2 distort = vec2(sineWave, sineWave2);

  // add the distortion to our texture coordinates
  // vec4 tex = texture2D(tex0, uv.x + distort);
  vec4 tex = texture2D(tex0, uv + distort);

  gl_FragColor = tex;
}