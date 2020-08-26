"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
// function
async function main_(source) {
    const listSource = __1.default.normalizePathToArray(source);
    if (listSource.length < 2)
        return false;
    // size
    let cacheSize = 0;
    for (const source of listSource) {
        const stat = await __1.default.stat_(source);
        if (!stat)
            return false;
        const { size } = stat;
        if (!cacheSize) {
            cacheSize = size;
            continue;
        }
        if (size !== cacheSize)
            return false;
    }
    // content
    let cacheCont = '';
    for (const source of listSource) {
        let cont = await __1.default.info().whisper_(async () => await __1.default.read_(source));
        if (!cont)
            return false;
        cont = __1.default.parseString(cont);
        if (!cacheCont) {
            cacheCont = cont;
            continue;
        }
        if (cont !== cacheCont)
            return false;
    }
    return true;
}
// export
exports.default = main_;
