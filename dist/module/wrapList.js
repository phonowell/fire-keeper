"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
function main(input) {
    if (!input)
        return '';
    return __1.default.formatArgument(input)
        .map(it => `'${it}'`)
        .join(', ');
}
exports.default = main;
