precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform sampler2D tex1;

uniform float mouseX;

void main() {

  vec2 uv = vTexCoord;
  uv = 1.0 - uv;

  vec4 cam = texture2D(tex0, uv);
  vec4 blur = texture2D(tex1, uv);

  float avg = dot(blur.rgb, vec3(0.33333));

  // Clamp blur to a certain value
  vec4 bloom = mix(cam, blur, clamp(avg*(1.0 + mouseX), 0.0, 1.0));

  gl_FragColor = bloom;
}