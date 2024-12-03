attribute vec3 aPosition;
attribute vec2 aTexCoord; // Input texture coordinates

varying vec2 vTexCoord; // Output texture coordinates to fragment shader

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    vTexCoord = aTexCoord; // Pass texCoord to fragment shader
}
