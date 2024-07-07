import React, { useEffect, useRef, useState } from 'react';

import contrastSafeVertexCode from './contrastSafeVertexCode';
import contrastSafeFragmentCode from './contrastSafeFragmentCode';
import { hexToRGB, rgbToHex, rgbToHSL } from './colorUtils';

import { colorHexValue } from './colour.types';

import './ContrastSafeColourPicker.scss';

export type onChangeColor= (color: colorHexValue) => void;

export type ContrastSafeColourPickerProps = {
    color: colorHexValue;
    onChangeColor: onChangeColor;
};



// React component that presents a colour picker that ensures the chosen colour has a contrast ratio of at least 4.5:1 with white text.
// The colour picker uses a WebGL shader to display the colour with a white text overlay to calculate the contrast ratio.
// The user can adjust the saturation, hue, and lightness of the colour to find a contrast safe colour.
// The chosen colour is displayed as a hex value and a coloured box.
// The component also displays instructions on how to use the colour picker.
// The user can select a colour by clicking on the canvas or by manually adjusting the hue, saturation, and lightness values.
// When the user clicks on the canvas or adjust the hue, saturation, or lihtness values a coordinate is calculated
// that is used to determine the colour displayed on the canvas. The pixel data of the canvas is read at that coordinate
// to determine the colour that the user has selected.
// Mouse coordinates are converted to pixel coordinates by scaling the mouse coordinates by the ratio of the canvas size to the client size of the canvas.
// hue and lightness values are used to calculate the pixel coordinate of the colour on the canvas accounting 
// for the differences in css pixel space and webgl pixel space.

const ContrastSafeColourPicker: React.FC<ContrastSafeColourPickerProps> = (
    props: ContrastSafeColourPickerProps
): React.ReactElement => {
    const { color, onChangeColor } = props;

    const devicePixelRatio = window.devicePixelRatio || 1;

    const [pickedColor, setPickedColor] = useState<colorHexValue>(color || '#000000');
    const [hue, setHue] = useState<number>(0);
    const [lightness, setLightness] = useState<number>(1.0);
    const [saturation, setSaturation] = useState<number>(1.0);
    const [canvasWidth, setCanvasWidth] = useState<number>(400 * 1 / devicePixelRatio);
    const [canvasHeight, setCanvasHeight] = useState<number>(150);

    const canvasContainerRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const MIN_CONTRAST = 4.5;
    const program = useRef<WebGLProgram | null>(null);
    const gl = useRef<WebGLRenderingContext | null>(null);

    const vertices: number[][] = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
    ];


    const onSaturationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const saturationValue = parseFloat(event.target.value);
        const newColor = readColorFromCanvas(hue, 1 - lightness); // invert the lightness value to match the canvas coordinate system
        setSaturation(saturationValue);
    };

    const onHueChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const hueValue = parseFloat(event.target.value);
        const newColor = readColorFromCanvas(hueValue, 1 - lightness); // invert the lightness value to match the canvas coordinate system
        setHue(hueValue);
    };

    const onLightnessChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const lightnessValue = parseFloat(event.target.value);
        const newColor = readColorFromCanvas(hue, 1 - lightnessValue); // invert the lightness value to match the canvas coordinate system  
        setLightness(lightnessValue);
    };

    // function to read the pixel data of the canvas from values in the range of 0 to 1
    // the pixel data is read at the pixelX and pixelY values. 
    // function is called when the user clicks the canvas and when the hue and lightness values are changed
    const readColorFromCanvas = (normalisedX: number, normalisedY: number): colorHexValue => {

        const glc: WebGLRenderingContext | null = gl.current;

        let newColor: colorHexValue = '#000000';

        if (glc) {
            const pixelX = normalisedX * glc.canvas.width;
            const pixelY = (1 - normalisedY) * glc.canvas.height; // invert the lightness value to match the canvas coordinate system

            const data = new Uint8Array(4);
            glc.readPixels(pixelX, pixelY, 1, 1, glc.RGBA, glc.UNSIGNED_BYTE, data);

            const [r, g, b] = data;
            // convert the rgb data to a hex color
            newColor = rgbToHex({ r, g, b });

        }
        return newColor

    }

    const onClickCanvas: React.MouseEventHandler<HTMLCanvasElement> = (event) => {

        const glc: WebGLRenderingContext | null = gl.current;

        if (glc && canvasContainerRef.current && canvasRef.current) {
            // const canvasContainer = canvasContainerRef.current;
            const canvas = canvasRef.current;

            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const pixelX = mouseX * glc.canvas.width / rect.width;
            const pixelY = mouseY * glc.canvas.height / rect.height;

            // calculate a positionX and positionY value to use to set the top and left of the marker
            // normalised to values between 0 and 1
            const normalisedHueValue = pixelX / glc.canvas.width;
            const normalisedLightnessValue = pixelY / glc.canvas.height;

            console.log('normalisedHueValue', normalisedHueValue, 'normalisedLightnessValue', normalisedLightnessValue);

            const newColor = readColorFromCanvas(normalisedHueValue, normalisedLightnessValue);
            setPickedColor(newColor);

            // set the hue and lightness values based on the positionX and positionY values
            setHue(normalisedHueValue);
            setLightness(1 - normalisedLightnessValue); // invert the lightness value to match the canvas coordinate system

        }

    };

    function draw(): void {
        const glc = gl.current;
        const drawProgram = program.current;


        if (glc && drawProgram) {
            glc.clearColor(0, 0, 0, 1);
            glc.clear(glc.COLOR_BUFFER_BIT);

            glc.useProgram(drawProgram);

            const canvasSizeUniform: WebGLUniformLocation | null = glc.getUniformLocation(drawProgram, 'canvasSize');
            const minContrastUniform: WebGLUniformLocation | null = glc.getUniformLocation(drawProgram, 'minContrast');
            const saturationUniform: WebGLUniformLocation | null = glc.getUniformLocation(drawProgram, 'saturation');

            glc.viewport(0, 0, glc.canvas.width, glc.canvas.height);

            glc.uniform2f(canvasSizeUniform, glc.canvas.width, glc.canvas.height);
            glc.uniform1f(minContrastUniform, MIN_CONTRAST);
            glc.uniform1f(saturationUniform, saturation);

            glc.drawArrays(glc.TRIANGLE_FAN, 0, vertices.length);
        }
    }

    useEffect((): void => {
        if (canvasRef.current) {
            setCanvasWidth(canvasRef.current.clientWidth * devicePixelRatio);
            setCanvasHeight(canvasRef.current.clientHeight * devicePixelRatio);
        }
    }, [])

    useEffect((): void => {
        const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
        if (canvas) {
            const newGL: WebGLRenderingContext = canvas.getContext('webgl2', {
                preserveDrawingBuffer: true,
                antialias: false,
                depth: false,
                stencil: false,
                failIfMajorPerformanceCaveat: true,
            }) as WebGLRenderingContext;

            if (!newGL) {
                throw new Error('WebGL2 not supported');
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

            }

            program.current = glc.createProgram() as WebGLProgram;

            if (program.current) {
                const vertexShader = createShader(glc.VERTEX_SHADER, contrastSafeVertexCode);
                const fragmentShader = createShader(glc.FRAGMENT_SHADER, contrastSafeFragmentCode);

                if (vertexShader && fragmentShader) {
                    glc.attachShader(program.current, vertexShader);
                    glc.attachShader(program.current, fragmentShader);
                    glc.linkProgram(program.current);
                    if (!glc.getProgramParameter(program.current, glc.LINK_STATUS)) {
                        throw new Error('Error linking shaders');
                    }
                } else {
                    throw new Error('Error creating vertex or fragment shader');
                }
            } else {
                throw new Error('Error creating glsl program');
            }

            const vertexData = new Float32Array(vertices.flat());
            glc.bindBuffer(glc.ARRAY_BUFFER, glc.createBuffer());
            glc.bufferData(glc.ARRAY_BUFFER, vertexData, glc.STATIC_DRAW);

            const vertexPosition = glc.getAttribLocation(program.current, 'vertexPosition');
            glc.enableVertexAttribArray(vertexPosition);
            glc.vertexAttribPointer(vertexPosition, 2, glc.FLOAT, false, 0, 0);

            draw();

        }


    }, [])

    useEffect((): void => {
        draw();
    }, [saturation])

    useEffect(() => {
        // Calculate the new color based on the current hue, lightness, and saturation values.
        // This assumes that readColorFromCanvas has been updated to work with the current state values directly,
        // or you adjust the call accordingly.
        const newColor = readColorFromCanvas(hue, 1 - lightness); // Note: Adjust as necessary for your use case
        setPickedColor(newColor);
    }, [hue, lightness, saturation]); // Dependencies: Recalculate when these values change

    useEffect((): void => {
        // convert the pickedColor to an hsl value
        // use the hsl value to set the hue, lightness and saturation values
        const rgbColor = hexToRGB(pickedColor);
        const hslColor = rgbToHSL(rgbColor);
        setSaturation(hslColor.s);
        setHue(hslColor.h);
        setLightness(hslColor.l);
    },[]);

        // function to call onChangeColor when the pickedColor changes
        useEffect((): void => {
            onChangeColor(pickedColor);
        }, [pickedColor]);


    // calculate the position of the pointer on the canvas based on the hue and lightness values
    const pointerX = hue * canvasWidth;
    const pointerY = (1 - lightness) * canvasHeight; // invert the lightness value to match the canvas coordinate system

    return (
        <form>
            <div className="contrast-safe instructions">Instructions go here</div>

            <div className="contrast-safe top-controls" style={{ width: '100%' }}>
                <fieldset>
                    <legend>Choose Saturation</legend>
                    <label htmlFor="contrast-safe-saturation">Saturation</label>
                    <input
                        type="range"
                        id="contrast-safe-saturation"
                        name="contrast-safe-saturation"
                        min="0"
                        max="1"
                        step="0.01"
                        value={saturation}
                        onInput={onSaturationChange}
                    />
                </fieldset>
            </div>

            <div
                ref={canvasContainerRef}
                id="contrast-safe-canvas-container"
                className="contrast-safe-canvas-container"
                style={{
                    width: `${canvasWidth}px`,
                    height: `${canvasHeight}px`,
                }}
            >

                <canvas
                    ref={canvasRef}
                    id="contrast-safe-canvas"
                    style={{
                        width: `${canvasWidth}px`,
                        height: `${canvasHeight}px`,
                    }}
                    onClick={onClickCanvas}
                ></canvas>

                <span
                    className="contrast-safe-marker"
                    style={{
                        top: `${pointerY - 12}px`,
                        left: `${pointerX - 12}px`,
                    }}
                >✜</span>
            </div>

            <fieldset>
                <legend>Choose Contrast Safe Colour</legend>
                <label htmlFor="contrast-safe-hue">Hue</label>
                <input
                    type="range"
                    id="contrast-safe-hue"
                    name="contrast-safe-hue"
                    min="0"
                    max="1"
                    step="0.01"
                    value={hue}
                    onInput={onHueChange}
                />
            </fieldset>

            <fieldset>
                <legend>Choose Lightness</legend>
                <label htmlFor="contrast-safe-lightness">Lightness</label>
                <input
                    type="range"
                    id="contrast-safe-lightness"
                    name="contrast-safe-lightness"
                    min="0"
                    max="1"
                    step="0.01"
                    value={lightness}
                    onInput={onLightnessChange}
                />
            </fieldset>

            <fieldset>
                <legend>Chosen Colour</legend>
                <label htmlFor="contrast-safe-color">Colour</label>
                <input
                    type="text"
                    id="contrast-safe-color"
                    name="contrast-safe-color"
                    value={pickedColor}
                    readOnly
                />
                <div
                    className="contrast-safe-picked-color"
                    style={{
                        backgroundColor: `${pickedColor}`,
                    }}
                >Picked Colour {pickedColor}</div>
            </fieldset>
        </form>
    );
};

export default ContrastSafeColourPicker;
