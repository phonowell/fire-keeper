"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = {};
const listModule = [
    'argv',
    'backup_',
    'clean_',
    'compile_',
    'copy_',
    'download_',
    'exec_',
    'formatArgument',
    'getBasename',
    'getDirname',
    'getExtname',
    'getFilename',
    'getName',
    'home',
    'i',
    'info',
    'isExisted_',
    'isSame_',
    'link_',
    'mkdir_',
    'move_',
    'normalizePath',
    'normalizePathToArray',
    'os',
    'parseJson',
    'parseString',
    'prompt_',
    'read_',
    'recover_',
    'remove_',
    'rename_',
    'require',
    'root',
    'say_',
    'sleep_',
    'source_',
    'stat_',
    'task',
    'type',
    'watch',
    'wrapList',
    'write_',
    'zip_'
];
const listTask = [
    'default'
];
for (const name of listModule) {
    const isAsync = name.endsWith('_');
    if (!isAsync) {
        $[name] = function (...args) {
            $[name] = require(`./module/${name}`).default;
            return $[name](...args);
        };
    }
    else {
        $[name] = async function (...args) {
            $[name] = require(`./module/${name}`).default;
            return await $[name](...args);
        };
    }
}
for (const name of listTask) {
    $.task(name, async function (...args) {
        const fn_ = require(`./task/${name}`).default;
        return await fn_(...args);
    });
}
exports.default = $;
