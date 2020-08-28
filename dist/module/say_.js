"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const Lang = {
    'ja': 'kyoko',
    'ja-jp': 'kyoko',
    'zh': 'ting-ting',
    'zh-cn': 'ting-ting',
    'zh-hk': 'sin-ji',
    'zh-tw': 'mei-jia'
};
async function main_(text, option = {}) {
    for (let message of __1.default.formatArgument(text)) {
        __1.default.info('say', message);
        if (!__1.default.os('macos'))
            continue;
        message = message
            .replace(/[#\(\)-]/g, '')
            .trim();
        if (!message)
            continue;
        const listCmd = ['say'];
        if (option.lang)
            listCmd.push(`--voice=${Lang[option.lang]}`);
        if (option.voice)
            listCmd.push(`--voice=${option.voice}`);
        listCmd.push(message);
        await __1.default.exec_(listCmd.join(' '), { silent: true });
    }
}
exports.default = main_;
