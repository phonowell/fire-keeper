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
// function
async function main_(source, target, option) {
    const listSource = __1.default.normalizePathToArray(source);
    if (target)
        target = __1.default.normalizePath(target);
    if (!listSource.length)
        return;
    await new Promise(resolve => {
        gulp_1.default.src(listSource, { allowEmpty: true })
            .pipe(gulp_if_1.default(!__1.default.info().isSilent, gulp_using_1.default()))
            .pipe(gulp_if_1.default(!!option, gulp_rename_1.default(option)))
            .pipe(gulp_1.default.dest(e => target || e.base))
            .on('end', () => resolve());
    });
    let msg = `copied ${__1.default.wrapList(source)} to 'target'`;
    if (option)
        msg += `, as '${__1.default.parseString(option)}'`;
    __1.default.info('file', msg);
}
// export
exports.default = main_;
