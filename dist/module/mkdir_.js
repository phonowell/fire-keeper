"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const fs_extra_1 = __importDefault(require("fs-extra"));
async function main_(source) {
    if (!source)
        throw new Error('mkdir_/error: empty source');
    const listSource = __1.default.normalizePathToArray(source);
    await Promise.all(listSource.map(it => fs_extra_1.default.ensureDir(it)));
    __1.default.info('file', `created ${__1.default.wrapList(source)}`);
}
exports.default = main_;
