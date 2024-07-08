import { RGBColor, hsl, colorHexValue } from "./colour.types";
import {
    numberToHex,
    rgbToHex,
    rgbToHSL,
    isValidHex,
    hexToRGB,
    formatHexToLongHex,
} from "./colorUtils";

describe("numberToHex", () => {
    it("should convert a number to a hex string", () => {
        expect(numberToHex(10)).toBe("0a");
        expect(numberToHex(255)).toBe("ff");
        expect(numberToHex(16)).toBe("10");
    });
});

describe("rgbToHex", () => {
    it("should convert an RGB color object to a hex color string", () => {
        const rgb: RGBColor = { r: 255, g: 0, b: 128 };
        expect(rgbToHex(rgb)).toBe("#ff0080");
    });
});

describe("rgbToHSL", () => {
    it("should convert an RGB color object to an HSL color object", () => {
        const rgb: RGBColor = { r: 255, g: 0, b: 128 };
        const hslResult: hsl = { h: 0.8333333333333334, s: 1, l: 0.5 };
        expect(rgbToHSL(rgb)).toEqual(hslResult);
    });
});

describe("isValidHex", () => {
    it("should check if a hex color string is valid", () => {
        expect(isValidHex("#ff0080")).toBe(true);
        expect(isValidHex("#123abc")).toBe(true);
        expect(isValidHex("#gggggg")).toBe(false);
        expect(isValidHex("ff0080")).toBe(false);
    });
});

describe("hexToRGB", () => {
    it("should convert a hex color string to an RGB color object", () => {
        const hex: colorHexValue = "#ff0080";
        const rgbResult: RGBColor = { r: 255, g: 0, b: 128 };
        expect(hexToRGB(hex)).toEqual(rgbResult);
    });

    it("should throw an error for an invalid hex color string", () => {
        const invalidHex: colorHexValue = "#gggggg";
        expect(() => hexToRGB(invalidHex)).toThrowError("Invalid hex color: #gggggg");
    });
});

describe("formatHexToLongHex", () => {
    it("should format a shorthand hex color string into a full hex color string", () => {
        expect(formatHexToLongHex("#f08")).toBe("#ff0088");
        expect(formatHexToLongHex("#123")).toBe("#112233");
        expect(formatHexToLongHex("#abcdef")).toBe("#abcdef");
    });
});