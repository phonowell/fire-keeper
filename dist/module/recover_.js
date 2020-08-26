"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
// function
async function main_(source) {
    const msg = `recovered ${__1.default.wrapList(source)}`;
    for (const src of __1.default.normalizePathToArray(source)) {
        const pathBak = `${src}.bak`;
        if (!await __1.default.isExisted_(pathBak)) {
            __1.default.info('recover', `'${pathBak}' not found`);
            continue;
        }
        const filename = __1.default.getFilename(src);
        __1.default.info().pause();
        await __1.default.remove_(src);
        await __1.default.copy_(pathBak, '', filename);
        await __1.default.remove_(pathBak);
        __1.default.info().resume();
    }
    __1.default.info('recover', msg);
}
// export
exports.default = main_;
