"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const gulp_1 = __importDefault(require("gulp"));
// variable
const keyPrivate = '__is_listed_as_source__';
// function
async function main_(source) {
    if (!source)
        return [];
    if (source instanceof Array)
        if (source[keyPrivate])
            return source;
    const group = __1.default.normalizePathToArray(source);
    return await new Promise(resolve => {
        const listSource = [];
        listSource[keyPrivate] = true;
        gulp_1.default.src(group, {
            allowEmpty: true,
            read: false
        })
            .on('data', (it) => listSource.push(it.path))
            .on('end', () => resolve(listSource));
    });
}
// export
exports.default = main_;
