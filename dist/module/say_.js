"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
// variable
const Lang = {
    'ja': 'kyoko',
    'ja-jp': 'kyoko',
    'zh': 'ting-ting',
    'zh-cn': 'ting-ting',
    'zh-hk': 'sin-ji',
    'zh-tw': 'mei-jia'
};
// function
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
        if (option.lang) {
            let lang = option.lang.toLowerCase();
            const name = Lang[lang];
            if (name)
                lang = name;
            listCmd.push(`--voice=${lang}`);
        }
        if (option.voice) {
            let voice = option.voice.toLowerCase();
            listCmd.push(`--voice=${voice}`);
        }
        listCmd.push(message);
        await __1.default.exec_(listCmd.join(' '), { silent: true });
    }
}
// export
exports.default = main_;
