"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const trimEnd_1 = __importDefault(require("lodash/trimEnd"));
const path_1 = __importDefault(require("path"));
// function
function main(source) {
    // validate
    if (typeof source !== 'string')
        return '';
    if (!source)
        return '';
    // ignore?
    const isIgnored = source[0] === '!';
    if (isIgnored)
        source = source.slice(1);
    // replace . & ~
    source = source.replace(/\.{2}/g, '__parent_directory__');
    if (source[0] === '.')
        source = source.replace(/\./, __1.default.root());
    else if (source[0] === '~')
        source = source.replace(/~/, __1.default.home());
    source = source.replace(/__parent_directory__/g, '..');
    // replace ../ to ./../ at start
    if (source.startsWith('..'))
        source = `${__1.default.root()}/${source}`;
    // normalize
    source = path_1.default.normalize(source)
        .replace(/\\/g, '/');
    // absolute
    if (!path_1.default.isAbsolute(source))
        source = `${__1.default.root()}/${source}`;
    // ignore?
    if (isIgnored)
        source = `!${source}`;
    return trimEnd_1.default(source, '/');
}
// export
exports.default = main;
