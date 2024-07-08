import { rgbToHex } from "./colorUtils";
import { colorHexValue } from "./colour.types";

export const VERTICES: number[][] = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
];

export const readColorFromCanvas = (
    glc: WebGLRenderingContext,
    normalisedX: number,
    normalisedY: number
): colorHexValue => {
    let newColor: colorHexValue = "#000000";

    if (glc) {
        const pixelX = normalisedX * glc.canvas.width;
        const pixelY = (1 - normalisedY) * glc.canvas.height;

        const data = new Uint8Array(4);
        glc.readPixels(pixelX, pixelY, 1, 1, glc.RGBA, glc.UNSIGNED_BYTE, data);

        const [r, g, b] = data;
        newColor = rgbToHex({ r, g, b });
    }
    return newColor;
};