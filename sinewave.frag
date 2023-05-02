precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform float time;
uniform float frequency;
uniform float amplitude;

void main() {

  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv = 1.0 - uv;
  
  float sineWave = sin(uv.y * frequency + time) * amplitude;

  // create a vec2 with our sine
  // what happens if you put sineWave in the y slot? in Both slots?
  //vec2 distort = vec2(sineWave, 0.3);
  
  vec2 distort = vec2(sineWave, 0.0);

  // add the distortion to our texture coordinates
  // vec4 tex = texture2D(tex0, uv.x + distort);
  vec4 tex = texture2D(tex0, uv + distort);

  gl_FragColor = tex;
}