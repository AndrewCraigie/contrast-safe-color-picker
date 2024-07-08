// __mocks__/webglMock.js
global.WebGLRenderingContext = {
    COMPILE_STATUS: 0x8B81,
    LINK_STATUS: 0x8B82,
};

const webGLContextMock = {
    createShader: jest.fn().mockImplementation((type) => ({ type, id: Math.random() })),
    shaderSource: jest.fn(),
    compileShader: jest.fn(),
    getShaderParameter: jest.fn().mockReturnValue(true),
    getShaderInfoLog: jest.fn().mockReturnValue(''),
    deleteShader: jest.fn(),
    createProgram: jest.fn().mockImplementation(() => ({ id: Math.random() })),
    attachShader: jest.fn(),
    linkProgram: jest.fn(),
    getProgramParameter: jest.fn().mockReturnValue(true),
    useProgram: jest.fn(),
    getUniformLocation: jest.fn().mockReturnValue({}),
    uniform2f: jest.fn(),
    uniform1f: jest.fn(),
    viewport: jest.fn(),
    clearColor: jest.fn(),
    clear: jest.fn(),
    drawArrays: jest.fn(),
    bindBuffer: jest.fn(),
    bufferData: jest.fn(),
    getAttribLocation: jest.fn().mockReturnValue(0),
    enableVertexAttribArray: jest.fn(),
    vertexAttribPointer: jest.fn(),
    createBuffer: jest.fn().mockImplementation(() => ({ id: Math.random() })),
    readPixels: jest.fn().mockImplementation((x, y, width, height, format, type, pixels) => {
        // Fill pixels array with mock data
        for (let i = 0; i < pixels.length; i++) {
            pixels[i] = 255;
        }
    }),
    canvas: {
        width: 300,
        height: 150,
    },
};

// fill pixels with red color
// readPixels: jest.fn().mockImplementation((x, y, width, height, format, type, pixels) => {
//     for (let i = 0; i < pixels.length; i += 4) {
//         pixels[i] = 255;     // Red
//         pixels[i + 1] = 0;   // Green
//         pixels[i + 2] = 0;   // Blue
//         pixels[i + 3] = 255; // Alpha
//     }
// }),

global.HTMLCanvasElement.prototype.getBoundingClientRect = function () {
    return {
        left: 0,
        top: 0,
        width: 300,
        height: 150,
    };
};

const context2DMock = {
    fillRect: jest.fn(),
    clearRect: jest.fn(),
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: jest.fn((contextType) => {
        if (contextType === "webgl" || contextType === "webgl2") {
            return webGLContextMock;
        } else if (contextType === "2d") {
            return context2DMock;
        }
        return null;
    }),
    writable: true
});
