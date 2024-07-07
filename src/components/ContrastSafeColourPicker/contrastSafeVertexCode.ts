const contrastSafeVertexCode = `#version 300 es // Do not move this from line 1
in vec4 vertexPosition;

void main() {
    gl_Position = vertexPosition;
}
`;

export default contrastSafeVertexCode;
