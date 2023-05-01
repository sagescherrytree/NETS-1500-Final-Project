#ifdef GL_ES
    precision mediump float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main()
{
    vTexCoord = aTexCoord;

    vec4 positionVec4 = vec4(aPosition, 1.0);

    // Scale
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0; 
    
    // Send to frag shader
    gl_Position = positionVec4;
}