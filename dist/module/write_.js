"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const fs_extra_1 = __importDefault(require("fs-extra"));
async function main_(source, content, option) {
    source = __1.default.normalizePath(source);
    content = __1.default.parseString(content);
    await fs_extra_1.default.outputFile(source, content, option);
    __1.default.info('file', `wrote ${__1.default.wrapList(source)}`);
    return true;
}
exports.default = main_;
