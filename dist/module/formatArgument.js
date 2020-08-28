"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
function main(input) {
    if (input instanceof Array)
        return [...input];
    if (typeof input === 'boolean')
        return [input];
    if (typeof input === 'number')
        return [input];
    if (typeof input === 'string')
        return [input];
    throw new Error(`formatArgument/error: invalid type '${__1.default.type(input)}'`);
}
exports.default = main;
