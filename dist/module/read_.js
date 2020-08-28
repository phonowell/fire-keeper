"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const fs_1 = __importDefault(require("fs"));
const listExtnameOfString = [
    '.css',
    '.html',
    '.js',
    '.md',
    '.pug',
    '.sh',
    '.styl',
    '.ts',
    '.txt',
    '.xml',
    '.coffee'
];
async function main_(source, option = {}) {
    const _source = source;
    const listSource = await __1.default.source_(source);
    if (!listSource.length) {
        __1.default.info('file', `'${_source}' not existed`);
        return null;
    }
    source = listSource[0];
    const content = await new Promise(resolve => {
        fs_1.default.readFile(source, (err, data) => {
            if (err)
                throw err;
            resolve(data);
        });
    });
    __1.default.info('file', `read '${_source}'`);
    if (option.raw)
        return content;
    const extname = __1.default.getExtname(source);
    if (listExtnameOfString.includes(extname))
        return __1.default.parseString(content);
    if (extname === '.json')
        return __1.default.parseJson(content);
    if (['.yaml', '.yml'].includes(extname)) {
        const jsYaml = require('js-yaml');
        return jsYaml.safeLoad(content);
    }
    return content;
}
exports.default = main_;
