"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const download_1 = __importDefault(require("download"));
function format(source, target, option) {
    if (!source)
        throw new Error('download_/error: empty source');
    if (source.startsWith('//'))
        source = `https:${source}`;
    if (!target)
        throw new Error('download_/error: empty target');
    target = __1.default.normalizePath(target);
    if (typeof option === 'string')
        option = { filename: option };
    const optionX = Object.assign({
        filename: '',
        timeout: 10e3
    }, option);
    return [source, target, optionX];
}
async function main_(source, target, option = {}) {
    await download_1.default.call(null, ...format(source, target, option));
    __1.default.info('download', `downloaded '${source}' to '${target}', as '${__1.default.parseString(option)}'`);
}
exports.default = main_;
