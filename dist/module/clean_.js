"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
async function main_(source) {
    const listSource = __1.default.normalizePathToArray(source);
    await __1.default.remove_(listSource);
    const dirname = __1.default.getDirname(listSource[0]);
    if ((await __1.default.source_(`${dirname}/**/*`)).length)
        return;
    await __1.default.remove_(dirname);
}
exports.default = main_;
