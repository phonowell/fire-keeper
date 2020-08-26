"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const fs_extra_1 = __importDefault(require("fs-extra"));
// function
async function main_(source) {
    const group = __1.default.normalizePathToArray(source);
    if (!group.length)
        return false;
    for (const source of group) {
        if (source.includes('*'))
            throw new Error(`invalid path '${source}'`);
        const isExisted = await fs_extra_1.default.pathExists(source);
        if (!isExisted)
            return false;
    }
    return true;
}
// export
exports.default = main_;
