import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Ensure the correct path to the webglMock.js
// import '../__mocks__/webGLMock';

import './__mocks__/webGLMock';

configure({ adapter: new Adapter() });



// // Define or mock necessary WebGL constants
// global.WebGLRenderingContext = {
//     COMPILE_STATUS: 0x8B81, // Add other constants as needed
//     LINK_STATUS: 0x8B82,
//   };

// // Mock for WebGLRenderingContext
// const webGLContextMock = {
//     createShader: jest.fn().mockImplementation((type) => {
//         // Simulate creating a shader based on type
//         return {type: type, id: Math.random()};
//     }),
//     getShaderParameter: jest.fn().mockReturnValue(true), // Simulate successful shader compilation
//     getShaderInfoLog: jest.fn().mockReturnValue(''),
//     createProgram: jest.fn().mockImplementation(() => {
//         // Simulate creating a WebGL program
//         return {id: Math.random()};
//     }),
//     getProgramParameter: jest.fn().mockImplementation((program, pname) => {
//         if (pname === WebGLRenderingContext.LINK_STATUS) {
//           return true; // Simulate successful program linking
//         }
//         return null;
//       }),
//     clearColor: jest.fn(),
//     clear: jest.fn(),
//     useProgram: jest.fn(),
//     viewport: jest.fn(),
//     uniform2f: jest.fn(),
//     uniform1f: jest.fn(),
//     drawArrays: jest.fn(),

//     shaderSource: jest.fn(),
//     compileShader: jest.fn(),
//     getShaderParameter: jest.fn(),
//     getShaderInfoLog: jest.fn(),
//     deleteShader: jest.fn(),

//     attachShader: jest.fn(),
//     linkProgram: jest.fn(),
//     getShaderParameter: jest.fn().mockImplementation((shader, pname) => {
//         if (pname === WebGLRenderingContext.COMPILE_STATUS) {
//           return true; // Simulate successful shader compilation
//         }
//         return null;
//       }),
//       getShaderInfoLog: jest.fn().mockReturnValue(''), // Return an empty string to simulate no errors
//     bindBuffer: jest.fn(),
//     bufferData: jest.fn(),
//     getAttribLocation: jest.fn(),
//     enableVertexAttribArray: jest.fn(),
//     vertexAttribPointer: jest.fn(),
//     canvas: {
//         width: 300,
//         height: 150,
//     },
//     VERTEX_SHADER: 0x8b31,
//     FRAGMENT_SHADER: 0x8b30,
//     COMPILE_STATUS: 0x8b81,
//     LINK_STATUS: 0x8b82,
//     COLOR_BUFFER_BIT: 0x4000,
//     ARRAY_BUFFER: 0x8892,
//     STATIC_DRAW: 0x88e4,
//     FLOAT: 0x1406,
//     TRIANGLE_FAN: 0x0006,
//     ARRAY_BUFFER: 34962,
//     VERTEX_SHADER: 35633,
//     FRAGMENT_SHADER: 35632,
//     COMPILE_STATUS: 35713,
//     LINK_STATUS: 35714,
//     TRIANGLE_FAN: 6,
// };

// // Mock for 2D context
// const context2DMock = {
//     // Add any necessary mock functions for 2D context
//     fillRect: jest.fn(),
//     clearRect: jest.fn(),
//     // Continue mocking methods you use
// };

// // Mock for WebGLRenderingContext
// Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
//     value: jest.fn((contextType) => {
//         if (contextType === "webgl" || contextType === "webgl2") {
//             return webGLContextMock;
//         } else if (contextType === "2d") {
//             return context2DMock;
//         }
//         // Return null for unsupported contexts
//         return null;
//     }),
//     writable: true
// });