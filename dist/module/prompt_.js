"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const findIndex_1 = __importDefault(require("lodash/findIndex"));
const get_1 = __importDefault(require("lodash/get"));
const prompts_1 = __importDefault(require("prompts"));
const listType = [
    'autocomplete',
    'confirm',
    'multiselect',
    'number',
    'select',
    'text',
    'toggle'
];
const listTypeCache = [
    'autocomplete',
    'confirm',
    'number',
    'select',
    'text',
    'toggle'
];
const mapMessage = {
    autocomplete: 'input',
    confirm: 'confirm',
    multiselect: 'select',
    number: 'input number',
    select: 'select',
    text: 'input text',
    toggle: 'toggle'
};
const pathCache = './temp/cache-prompt.json';
async function main_(option) {
    if (!option)
        throw new Error('prompt_/error: empty option');
    __1.default.info().pause();
    const opt = await setOption_(option);
    const result = (await prompts_1.default(opt))[opt.name];
    await setCache_(option, result);
    __1.default.info().resume();
    return result;
}
async function getCache_(option) {
    if (!option.id)
        return;
    if (!listTypeCache.includes(option.type))
        return;
    const cache = await __1.default.read_(pathCache);
    const item = get_1.default(cache, option.id);
    if (!item)
        return;
    const { type, value } = item;
    if (type !== option.type)
        return;
    if (type === 'select') {
        const index = findIndex_1.default(option.choices, { value });
        return ~index
            ? index
            : undefined;
    }
    return value;
}
async function setCache_(option, value) {
    const { id, type } = option;
    if (!id)
        return;
    const cache = await __1.default.read_(pathCache) || {};
    cache[id] = {
        type: type === 'auto'
            ? 'autocomplete'
            : type,
        value
    };
    await __1.default.write_(pathCache, cache);
}
async function setOption_(option) {
    const opt = { ...option };
    Object.assign(opt, {
        id: undefined
    });
    if (opt.type === 'auto')
        opt.type = 'autocomplete';
    if (!listType.includes(opt.type))
        throw new Error(`prompt_/error: invalid type '${opt.type}'`);
    if (!opt.message)
        opt.message = mapMessage[opt.type];
    if (!opt.name)
        opt.name = 'value';
    if (['autocomplete', 'multiselect', 'select'].includes(opt.type)) {
        if (!opt.list)
            throw new Error('prompt_/error: empty list');
        opt.choices = [...opt.list]
            .map((it) => __1.default.type(it) === 'object'
            ? it
            : {
                title: __1.default.parseString(it),
                value: it
            });
        opt.list = undefined;
    }
    else if (opt.type === 'toggle') {
        if (!opt.active)
            opt.active = 'on';
        if (!opt.inactive)
            opt.inactive = 'off';
    }
    if (['null', 'undefined'].includes(typeof opt.initial))
        opt.initial = opt.default || await getCache_(option);
    opt.default = undefined;
    return opt;
}
exports.default = main_;
