const contrastSafeFragmentCode = `#version 300 es  // do not move this from line 1
    precision highp float;
    uniform vec2 canvasSize;
    uniform float minContrast;
    uniform float saturation;
    out vec4 fragColor;

    vec3 hsb2rgb(in vec3 color) {  
        vec3 rgb = clamp(abs(mod(color.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        rgb = rgb * rgb * (3.0 - 2.0 * rgb);
        return color.z * mix(vec3(1.0), rgb, color.y);
    }

    float luminance(in vec3 color) {
        color = pow(color, vec3(2.2)); // gamma correction convert to linear space
        const vec3 lum = vec3(0.2126, 0.7152, 0.0722); // constants for relative luminance
        return dot(color, lum);
    }

    float contrast(in vec3 color1, in vec3 color2) {
        float luminance1 = luminance(color1);
        float luminance2 = luminance(color2);
        float brightest = max(luminance1, luminance2);
        float darkest = min(luminance1, luminance2);
        return (brightest + 0.05) / (darkest + 0.05); // add 0.05 to avoid division by zero
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / canvasSize;
        vec3 color = hsb2rgb(vec3(uv.x, saturation, uv.y));
        vec3 textColor = vec3(1.0, 1.0, 1.0); // White text color in sRGB
        float contrastRatio = contrast(textColor, color);
        if (contrastRatio >= minContrast) {
            fragColor = vec4(color, 1.0); // Color in sRGB
        } else {
            fragColor = vec4(0.0, 0.0, 0.0, 1.0); // Replace with black if contrast is too low
        }
    }
`;

export default contrastSafeFragmentCode;
