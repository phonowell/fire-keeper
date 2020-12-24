"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const archiver_1 = __importDefault(require("archiver"));
const fs_1 = __importDefault(require("fs"));
const kleur_1 = __importDefault(require("kleur"));
const ora_1 = __importDefault(require("ora"));
const trim_1 = __importDefault(require("lodash/trim"));
async function archive_(listSource, target, option) {
    const { base, filename } = option;
    const spinner = ora_1.default().start();
    await new Promise(async (resolve) => {
        const output = fs_1.default.createWriteStream(`${target}/${filename}`);
        const archive = archiver_1.default('zip', {
            zlib: {
                level: 9
            }
        });
        let message = '';
        archive.on('end', () => {
            spinner.succeed();
            resolve(true);
        });
        archive.on('entry', e => {
            message = __1.default.info().renderPath(`${e.name}`);
        });
        archive.on('error', e => {
            spinner.fail(e.message);
            throw (e);
        });
        archive.on('progress', e => {
            if (!message)
                return;
            const gray = kleur_1.default.gray(`${Math.round(e.fs.processedBytes * 100 / e.fs.totalBytes)}%`);
            const magenta = kleur_1.default.magenta(message);
            spinner.text = `${gray} ${magenta}`;
            message = '';
        });
        archive.on('warning', e => {
            spinner.warn(e.message);
            throw (e);
        });
        archive.pipe(output);
        for (const src of await __1.default.source_(listSource)) {
            const name = src.replace(base, '');
            archive.file(src, { name });
        }
        archive.finalize();
    });
}
function formatArgument(source, target, option) {
    const listSource = __1.default.normalizePathToArray(source);
    const pathTarget = __1.default.normalizePath(target || __1.default.getDirname(listSource[0]).replace(/\*/g, ''));
    let [base, filename] = typeof option === 'string'
        ? ['', option]
        : [
            option.base || '',
            option.filename || ''
        ];
    base = __1.default.normalizePath(base || getBase(listSource));
    if (!filename)
        filename = `${__1.default.getBasename(pathTarget)}.zip`;
    return [
        listSource,
        pathTarget,
        {
            base,
            filename
        }
    ];
}
function getBase(listSource) {
    const [source] = listSource;
    if (source.includes('*'))
        return trim_1.default(source.replace(/\*.*/, ''), '/');
    return __1.default.getDirname(source);
}
async function main_(source, target = '', option = '') {
    await archive_(...formatArgument(source, target, option));
    __1.default.info('zip', `zipped ${__1.default.wrapList(source)} to '${target}', as '${option.toString()}'`);
}
exports.default = main_;
