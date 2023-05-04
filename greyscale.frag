precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D tex0;


// Equivalent to reinhardt op and gamma correction
float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}


void main() {

  vec2 uv = vTexCoord;
  uv = 1.0 - uv;

  vec4 tex = texture2D(tex0, uv);

  float gray = luma(tex.rgb);

  gl_FragColor = vec4(gray, gray, gray, 1.0);
}