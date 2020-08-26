"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const fs_extra_1 = __importDefault(require("fs-extra"));
// function
async function main_(source, target) {
    source = __1.default.normalizePath(source);
    target = __1.default.normalizePath(target);
    await fs_extra_1.default.ensureSymlink(source, target);
    __1.default.info('file', `linked '${source}' to '${target}'`);
}
// export
exports.default = main_;
