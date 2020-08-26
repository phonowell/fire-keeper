"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const kleur_1 = __importDefault(require("kleur"));
// function
class M {
    constructor() {
        this.cacheTime = [0, ''];
        this.cacheType = {
            default: ''
        };
        this.isFrozen = false;
        this.isSilent = false;
        this.regHome = new RegExp(`^${__1.default.home()}`, 'g');
        this.regRoot = new RegExp(`^${__1.default.root()}`, 'g');
        this.separator = `${kleur_1.default.gray('›')} `;
    }
    execute(...args) {
        if (!args.length)
            return this;
        const [type, message] = args.length > 1
            ? args
            : ['default', args[0]];
        if (this.isSilent)
            return message;
        const msg = __1.default.parseString(message)
            .trim();
        if (!msg)
            return message;
        __1.default.i(this.render(type, msg));
        return message;
    }
    async freeze_(fn_) {
        Object.assign(this, {
            isFrozen: true,
            isSilent: true
        });
        const result = await fn_();
        Object.assign(this, {
            isFrozen: false,
            isSilent: false
        });
        return result;
    }
    makeTextOfTime() {
        const date = new Date();
        const listTime = [
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ];
        return listTime
            .map(it => it.toString().padStart(2, '0'))
            .join(':');
    }
    pause() {
        if (this.isFrozen)
            return;
        this.isSilent = true;
    }
    render(type, message) {
        return [
            this.renderTime(),
            this.separator,
            this.renderType(type),
            this.renderContent(message)
        ].join('');
    }
    renderContent(message) {
        return this.renderPath(message)
            // 'xxx'
            .replace(/'.*?'/g, text => {
            const cont = text.replace(/'/g, '');
            return cont
                ? kleur_1.default.magenta(cont)
                : "''";
        });
    }
    renderPath(message) {
        return message
            .replace(this.regRoot, '.')
            .replace(this.regHome, '~');
    }
    renderTime() {
        const cache = this.cacheTime;
        const ts = Math.floor(new Date().getTime() / 1e3);
        if (ts === cache[0])
            return cache[1];
        cache[0] = ts;
        cache[1] = `${kleur_1.default.gray(`[${this.makeTextOfTime()}]`)} `;
        return cache[1];
    }
    renderType(type) {
        const cache = this.cacheType;
        type = type
            .trim()
            .toLowerCase();
        if (typeof cache[type] === 'string')
            return cache[type];
        const content = kleur_1.default.cyan().underline(type);
        const padding = ' '.repeat(Math.max(10 - type.length, 0));
        cache[type] = `${content}${padding}`;
        return cache[type];
    }
    resume() {
        if (this.isFrozen)
            return;
        this.isSilent = false;
    }
    async whisper_(fn_) {
        this.pause();
        const result = await fn_();
        this.resume();
        return result;
    }
}
// export
const m = new M();
exports.default = m.execute.bind(m);
