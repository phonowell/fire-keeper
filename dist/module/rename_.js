"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const gulp_1 = __importDefault(require("gulp"));
const gulp_if_1 = __importDefault(require("gulp-if"));
const gulp_using_1 = __importDefault(require("gulp-using"));
const gulp_rename_1 = __importDefault(require("gulp-rename"));
async function main_(source, option) {
    const listSource = __1.default.normalizePathToArray(source);
    const listHistory = [];
    await new Promise(resolve => {
        gulp_1.default.src(listSource, { allowEmpty: true })
            .pipe(gulp_if_1.default(!__1.default.info().isSilent, gulp_using_1.default()))
            .pipe(gulp_rename_1.default(option))
            .pipe(gulp_1.default.dest((e) => {
            listHistory.push([...e.history]);
            return e.base;
        }))
            .on('end', () => resolve());
    });
    __1.default.info().pause();
    for (const item of listHistory) {
        if (await __1.default.isExisted_(item[1]))
            await __1.default.remove_(item[0]);
    }
    __1.default.info().resume();
    __1.default.info('file', `renamed ${__1.default.wrapList(source)} as '${__1.default.parseString(option)}'`);
}
exports.default = main_;
