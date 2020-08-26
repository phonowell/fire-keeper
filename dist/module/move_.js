"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
// function
async function main_(source, target, option) {
    const listSource = await __1.default.source_(source);
    if (!listSource.length)
        return;
    await __1.default.info().whisper_(async () => {
        await __1.default.copy_(listSource, target, option);
        await __1.default.remove_(listSource);
    });
    let msg = `moved ${__1.default.wrapList(listSource)} to '${target}'`;
    if (option)
        msg += `, as '${__1.default.parseString(option)}'`;
    __1.default.info('file', msg);
}
// export
exports.default = main_;
