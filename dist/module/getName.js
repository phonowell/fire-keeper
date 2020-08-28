"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function main(input) {
    if (!input)
        throw new Error(`getName/error: empty input`);
    input = input
        .replace(/\\/g, '/');
    const extname = path_1.default.extname(input);
    const basename = path_1.default.basename(input, extname);
    const dirname = path_1.default.dirname(input);
    const filename = `${basename}${extname}`;
    return { basename, dirname, extname, filename };
}
exports.default = main;
