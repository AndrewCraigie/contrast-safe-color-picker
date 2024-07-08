import React, { useEffect, useRef, useState } from "react";

import ZeroToOneSlider, { inputChangeParams } from "../ZeroToOneSlider/ZeroToOneSlider";
import { readColorFromCanvas, VERTICES } from "./contrastSafeColourPickerUtils";
import contrastSafeVertexCode from "./contrastSafeVertexCode";
import contrastSafeFragmentCode from "./contrastSafeFragmentCode";
import { hexToRGB, rgbToHSL } from "./colorUtils";

import { colorHexValue } from "./colour.types";

import "./ContrastSafeColourPicker.scss";

export type onChangeColor = (color: colorHexValue) => void;

export type ContrastSafeColourPickerProps = {
    color: colorHexValue;
    onChangeColor: onChangeColor;
};

export interface GraphicsState {
    hue: number;
    lightness: number;
    saturation: number;
}

// Requirements of component and suggested tests:
// The component should display sliders for selecting the saturation, hue, and lightness of a color.
// The component should update the selected color based on the values of the sliders.
// The component should render a canvas where the user can click to select a color.
// The component should update the selected color based on the clicked position on the canvas.
// The component should display the selected color in an input field.
// The component should call the onChangeColor callback when the selected color changes.
// Based on these requirements, here are some possible tests that could be written to cover them:

// Test that the sliders are rendered correctly and that changing their values updates the selected color.
// Test that clicking on the canvas updates the selected color based on the clicked position.
// Test that the selected color is displayed correctly in the input field.
// Test that the onChangeColor callback is called when the selected color changes.
// Test that the component initializes with the correct initial color based on the color prop.
// Test that the component updates the selected color when the color prop changes.
// These tests should cover the basic functionality of the ContrastSafeColourPicker component and ensure that it behaves as expected.Based on the code provided, it appears that the ContrastSafeColourPicker component is responsible for rendering a color picker interface. Here are some possible requirements/acceptance criteria for this component:

// The component should display sliders for selecting the saturation, hue, and lightness of a color.
// The component should update the selected color based on the values of the sliders.
// The component should render a canvas where the user can click to select a color.
// The component should update the selected color based on the clicked position on the canvas.
// The component should display the selected color in an input field.
// The component should call the onChangeColor callback when the selected color changes.
// Based on these requirements, here are some possible tests that could be written to cover them:

// Test that the sliders are rendered correctly and that changing their values updates the selected color.
// Test that clicking on the canvas updates the selected color based on the clicked position.
// Test that the selected color is displayed correctly in the input field.
// Test that the onChangeColor callback is called when the selected color changes.
// Test that the component initializes with the correct initial color based on the color prop.
// Test that the component updates the selected color when the color prop changes.
// These tests should cover the basic functionality of the ContrastSafeColourPicker component and ensure that it behaves as expected.

const ContrastSafeColourPicker: React.FC<ContrastSafeColourPickerProps> = (
    props: ContrastSafeColourPickerProps
): React.ReactElement => {
    const { color, onChangeColor } = props;

    const devicePixelRatio = window.devicePixelRatio || 1;

    const [pickedColor, setPickedColor] = useState<colorHexValue>(color || "#000000");

    const hslColor = rgbToHSL(hexToRGB(color));
    const [graphicsState, setGraphicsState] = useState<GraphicsState>({
        hue: hslColor.h,
        lightness: hslColor.l,
        saturation: hslColor.s,
    });

    const canvasContainerRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const MIN_CONTRAST = 4.5;
    const program = useRef<WebGLProgram | null>(null);
    const gl = useRef<WebGLRenderingContext | null>(null);

    const handleInputChange = (params: inputChangeParams): void => {
        const glc: WebGLRenderingContext | null = gl.current;

        if (glc) {
            const value = params.value;

            const hueValue = params.type === "hue" ? value : graphicsState.hue;
            const lightnessValue = params.type === "lightness" ? value : graphicsState.lightness;
            const saturationValue = params.type === "saturation" ? value : graphicsState.saturation;

            const newGraphicsState = {
                ...graphicsState,
                hue: hueValue,
                lightness: lightnessValue,
                saturation: saturationValue,
            };

            setGraphicsState(newGraphicsState);
        }
    };

    const onClickCanvas: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
        const glc: WebGLRenderingContext | null = gl.current;

        if (glc && canvasContainerRef.current && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const pixelX = (mouseX * glc.canvas.width) / rect.width;
            const pixelY = (mouseY * glc.canvas.height) / rect.height;

            const normalisedHueValue = pixelX / glc.canvas.width;
            const normalisedLightnessValue = pixelY / glc.canvas.height;

            setGraphicsState({
                ...graphicsState,
                hue: normalisedHueValue,
                lightness: 1 - normalisedLightnessValue,
            });
        }
    };

    function draw(): void {
        const glc = gl.current;
        const drawProgram = program.current;

        if (glc && drawProgram) {
            glc.clearColor(0, 0, 0, 1);
            glc.clear(glc.COLOR_BUFFER_BIT);

            glc.useProgram(drawProgram);

            const canvasSizeUniform: WebGLUniformLocation | null = glc.getUniformLocation(
                drawProgram,
                "canvasSize"
            );
            const minContrastUniform: WebGLUniformLocation | null = glc.getUniformLocation(
                drawProgram,
                "minContrast"
            );
            const saturationUniform: WebGLUniformLocation | null = glc.getUniformLocation(
                drawProgram,
                "saturation"
            );

            glc.viewport(0, 0, glc.canvas.width, glc.canvas.height);

            console.log(glc.canvas.width, glc.canvas.height);

            glc.uniform2f(canvasSizeUniform, glc.canvas.width, glc.canvas.height);
            glc.uniform1f(minContrastUniform, MIN_CONTRAST);
            glc.uniform1f(saturationUniform, graphicsState.saturation);

            glc.drawArrays(glc.TRIANGLE_FAN, 0, VERTICES.length);
        }
    }

    useEffect((): void => {
        const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
        if (canvas) {
            const newGL: WebGLRenderingContext = canvas.getContext("webgl2", {
                preserveDrawingBuffer: true,
                antialias: false,
                depth: false,
                stencil: false,
                failIfMajorPerformanceCaveat: true,
            }) as WebGLRenderingContext;

            if (!newGL) {
                throw new Error("WebGL2 not supported");
            } else {
                gl.current = newGL;
            }
        }
    });

    useEffect((): void => {
        const glc = gl.current;

        if (glc) {
            const createShader = (shaderType: number, sourceCode: string): WebGLShader => {
                const shader: WebGLShader | null = glc.createShader(shaderType) as WebGLShader;

                if (shader && glc) {
                    glc.shaderSource(shader, sourceCode);
                    glc.compileShader(shader);

                    if (!glc.getShaderParameter(shader, glc.COMPILE_STATUS)) {
                        const infoLog = glc.getShaderInfoLog(shader);
                        glc.deleteShader(shader);
                        throw new Error(`An error occurred compiling the shaders: ${infoLog}`);
                    }
                }

                return shader;
            };

            program.current = glc.createProgram() as WebGLProgram;

            if (program.current) {
                const vertexShader = createShader(glc.VERTEX_SHADER, contrastSafeVertexCode);
                const fragmentShader = createShader(glc.FRAGMENT_SHADER, contrastSafeFragmentCode);

                if (vertexShader && fragmentShader) {
                    glc.attachShader(program.current, vertexShader);
                    glc.attachShader(program.current, fragmentShader);
                    glc.linkProgram(program.current);
                    if (!glc.getProgramParameter(program.current, glc.LINK_STATUS)) {
                        throw new Error("Error linking shaders");
                    }
                } else {
                    throw new Error("Error creating vertex or fragment shader");
                }
            } else {
                throw new Error("Error creating glsl program");
            }

            const vertexData = new Float32Array(VERTICES.flat());
            glc.bindBuffer(glc.ARRAY_BUFFER, glc.createBuffer());
            glc.bufferData(glc.ARRAY_BUFFER, vertexData, glc.STATIC_DRAW);

            const vertexPosition = glc.getAttribLocation(program.current, "vertexPosition");
            glc.enableVertexAttribArray(vertexPosition);
            glc.vertexAttribPointer(vertexPosition, 2, glc.FLOAT, false, 0, 0);

            draw();
        }
    }, []);

    useEffect((): void => {
        draw();
    }, [graphicsState.saturation]);

    useEffect(() => {
        const glc = gl.current;

        if (glc) {
            const newColor = readColorFromCanvas(glc, graphicsState.hue, 1 - graphicsState.lightness);
            setPickedColor(newColor);
        }
    }, [graphicsState]);

    useEffect((): void => {
        onChangeColor(pickedColor);
    }, [pickedColor]);

    let pointerX = 0;
    let pointerY = 0;
    if (canvasRef.current && canvasContainerRef.current) {
        pointerX = graphicsState.hue * canvasRef.current.clientWidth + canvasRef.current.offsetLeft;
        pointerY =
            (1 - graphicsState.lightness) * canvasRef.current.clientHeight + canvasRef.current.offsetTop;
    }

    return (
        <form className="constrast-safe-colour-picker" aria-controls="contrast-safe-picked-color">
            <div className="contrast-safe instructions">Instructions go here</div>

            <div className="contrast-safe top-controls">
                <ZeroToOneSlider
                    value={graphicsState.saturation}
                    legendText="Choose Saturation"
                    labelText="Saturation"
                    type="saturation"
                    handleInputChange={handleInputChange}
                />
            </div>

            <div ref={canvasContainerRef} id="contrast-safe-canvas-container" className="contrast-safe-canvas-container">
                <canvas ref={canvasRef} id="contrast-safe-canvas" onClick={onClickCanvas}></canvas>
                <span
                    className="contrast-safe-marker"
                    style={{
                        top: `${pointerY - 12}px`,
                        left: `${pointerX - 12}px`,
                    }}
                >
                    ✜
                </span>
            </div>

            <ZeroToOneSlider
                value={graphicsState.hue}
                legendText="Choose Hue"
                labelText="Hue"
                type="hue"
                handleInputChange={handleInputChange}
            />

            <ZeroToOneSlider
                value={graphicsState.lightness}
                legendText="Choose Lightness"
                labelText="Lightness"
                type="lightness"
                handleInputChange={handleInputChange}
            />

            <fieldset className="contrast-safe-color-output">
                <legend className="visually-hidden">Chosen Colour</legend>
                <label htmlFor="contrast-safe-color">Picked Colour</label>
                <input
                    type="text"
                    id="contrast-safe-color"
                    name="contrast-safe-color"
                    value={pickedColor}
                    style={{
                        color: "#ffffff",
                        backgroundColor: `${pickedColor}`,
                    }}
                    readOnly
                />
                <div
                    id="contrast-safe-picked-color"
                    role="region"
                    aria-live="polite"
                    className="visually-hidden"
                >
                    Picked Colour {pickedColor}
                </div>
            </fieldset>
        </form>
    );
};

export default ContrastSafeColourPicker;
