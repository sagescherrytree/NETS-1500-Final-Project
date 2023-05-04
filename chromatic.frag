precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform float valence;


void main() {

  vec2 uv = vTexCoord;
  uv = 1.0 - uv;

  // Amount to displace
  float amount = valence;
  float red = texture2D(tex0, vec2(uv.x - amount)).r + 0.16;
  float green = texture2D(tex0, uv).g + 0.15;
  float blue = texture2D(tex0, vec2(uv.x + amount)).b + 0.14;

  gl_FragColor = vec4(red, green, blue, 1.0);
}