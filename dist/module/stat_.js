"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const fs_1 = __importDefault(require("fs"));
async function main_(source) {
    source = __1.default.normalizePath(source);
    if (!await __1.default.isExisted_(source)) {
        __1.default.info('file', `${__1.default.wrapList(source)} not existed`);
        return null;
    }
    return await new Promise(resolve => {
        fs_1.default.stat(source, (err, stat) => {
            if (err)
                throw err;
            resolve(stat);
        });
    });
}
exports.default = main_;
