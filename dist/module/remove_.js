"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const fs_extra_1 = __importDefault(require("fs-extra"));
// function
async function main_(source) {
    const listSource = await __1.default.source_(source);
    if (!listSource.length)
        return;
    const msg = `removed ${__1.default.wrapList(source)}`;
    for (const source of listSource)
        await fs_extra_1.default.remove(source);
    __1.default.info('remove', msg);
}
// export
exports.default = main_;
