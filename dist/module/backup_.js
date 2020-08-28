"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
async function main_(source) {
    const msg = `backed up ${__1.default.wrapList(source)}`;
    for (const src of await __1.default.source_(source)) {
        const suffix = __1.default.getExtname(src);
        const extname = '.bak';
        await __1.default.info().whisper_(async () => {
            await __1.default.copy_(src, '', { extname, suffix });
        });
    }
    __1.default.info('backup', msg);
}
exports.default = main_;
