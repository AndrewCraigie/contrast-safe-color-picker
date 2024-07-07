import { colorHexValue, RGBColor, hsl } from "./colour.types";

export const numberToHex = (num: number): string => {
    const hex = num.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
};

export const rgbToHex = (rgb: RGBColor): colorHexValue => {
    const hex: string = [rgb.r, rgb.g, rgb.b]
        .map((colorValue: number) => numberToHex(colorValue))
        .join("");

    return `#${hex}`;
};

// function to convert and RGB object to an hsl color object
export const rgbToHSL = (rgb: RGBColor): hsl => {
    const red = rgb.r / 255;
    const green = rgb.g / 255;
    const blue = rgb.b / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;

    if (max === min) { // The color is achromatic - a shade of grey
        return { h: 0, s: 0, l: lightness };
    }

    const delta = max - min;
    const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    let hue: number;
    switch (max) {
        case red:
            hue = (green - blue) / delta + (green < blue ? 6 : 0);
            break;
        case green:
            hue = (blue - red) / delta + 2;
            break;
        default:
            hue = (red - green) / delta + 4;
            break;
    }

    hue /= 6;

    return { h: hue, s: saturation, l: lightness };
};

// function to check if a hex color string is valid
export const isValidHex = (hex: colorHexValue): boolean => {
    return /^#[0-9A-F]{6}$/i.test(hex);
};

// convert a hex color string into an array of strings representing the RGB values
const hexTohexArray = (hex: colorHexValue): string[] => {
    return hex
        .replace("#", "")
        .match(/.{1,2}/g) || [];
};

// convert a hex string to an RGB object calling hexTohexArray
export const hexToRGB = (hex: colorHexValue): RGBColor => {
    if (!isValidHex(hex)) {
        throw new Error(`Invalid hex color: ${hex}`);
    }
    const [r, g, b] = hexTohexArray(hex).map((hexValue: string) => parseInt(hexValue, 16));
    return { r, g, b };
};


// function to format a shorthand hex color string into a full hex color string
export const formatHexToLongHex = (hex: colorHexValue): colorHexValue => {
    if (hex.length === 4) {
        return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    return hex;
};
