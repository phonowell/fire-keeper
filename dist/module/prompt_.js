"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const findIndex_1 = __importDefault(require("lodash/findIndex"));
const get_1 = __importDefault(require("lodash/get"));
const prompts_1 = __importDefault(require("prompts"));
// function
class M {
    constructor() {
        this.listType = [
            'autocomplete',
            'confirm',
            'multiselect',
            'number',
            'select',
            'text',
            'toggle'
        ];
        this.listTypeCache = [
            'autocomplete',
            'confirm',
            'number',
            'select',
            'text',
            'toggle'
        ];
        this.mapMessage = {
            confirm: 'confirm',
            multiselect: 'select',
            number: 'input number',
            select: 'select',
            text: 'input text',
            toggle: 'toggle'
        };
        this.pathCache = './temp/cache-prompt.json';
    }
    async execute_(option) {
        if (!option)
            throw new Error('prompt_/error: empty option');
        __1.default.info().pause();
        const opt = await this.setOption_(option);
        const result = (await prompts_1.default(opt))[opt.name];
        await this.setCache_(option, result);
        __1.default.info().resume();
        return result;
    }
    async getCache_(option) {
        if (!option.id)
            return;
        if (!this.listTypeCache.includes(option.type))
            return;
        const cache = await __1.default.read_(this.pathCache);
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
    async setCache_(option, value) {
        const { id, type } = option;
        if (!id)
            return;
        const cache = await __1.default.read_(this.pathCache) || {};
        cache[id] = {
            type: type === 'auto'
                ? 'autocomplete'
                : type,
            value
        };
        await __1.default.write_(this.pathCache, cache);
    }
    async setOption_(option) {
        // clone
        const opt = { ...option };
        Object.assign(opt, {
            id: undefined
        });
        // alias
        if (opt.type === 'auto')
            opt.type = 'autocomplete';
        // check type
        if (!this.listType.includes(opt.type))
            throw new Error(`prompt_/error: invalid type '${opt.type}'`);
        // default value
        if (!opt.message)
            opt.message = this.mapMessage[opt.type] || 'input';
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
        // have to be here
        // behind option.choices
        if (['null', 'undefined'].includes(typeof opt.initial))
            opt.initial = opt.default || await this.getCache_(option);
        opt.default = undefined;
        return opt;
    }
}
// export
const m = new M();
exports.default = m.execute_.bind(m);
