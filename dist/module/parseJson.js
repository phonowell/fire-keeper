"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
// function
function main(input) {
    if (typeof input === 'string')
        return JSON.parse(input);
    if (input instanceof Array)
        return input;
    if (input instanceof Uint8Array)
        return JSON.parse(input.toString());
    const type = __1.default.type(input);
    if (type === 'object')
        return input;
    throw new Error(`parseJson/error: invalid type '${type}'`);
}
// export
exports.default = main;
