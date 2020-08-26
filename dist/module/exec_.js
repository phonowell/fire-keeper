"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const child_process_1 = __importDefault(require("child_process"));
const kleur_1 = __importDefault(require("kleur"));
const trimEnd_1 = __importDefault(require("lodash/trimEnd"));
// function
class M {
    constructor() {
        this.spawn = child_process_1.default.spawn;
    }
    close() {
        if (!this.process)
            return;
        this.process.kill();
    }
    async execute_(cmd, option = {}) {
        const stringCmd = cmd instanceof Array
            ? cmd.join(' && ')
            : cmd;
        const [cmder, arg] = __1.default.os() === 'macos'
            ? ['/bin/sh', ['-c', stringCmd]]
            : ['cmd.exe', ['/s', '/c', stringCmd]];
        if (!option.silent)
            __1.default.info('exec', stringCmd);
        return await new Promise(resolve => {
            let result = '';
            this.process = this.spawn(cmder, arg, {});
            this.process.stderr.on('data', (data) => {
                result = this.parseMessage(data);
                if (!option.silent)
                    this.info('error', data.toString());
            });
            this.process.stdout.on('data', (data) => {
                result = this.parseMessage(data);
                if (!option.silent)
                    this.info('default', data.toString());
            });
            this.process.on('close', (code) => {
                if (code === 0 || option.ignoreError)
                    resolve([true, result]);
                resolve([false, result]);
            });
        });
    }
    info(type, message) {
        message = message.trim();
        if (!message)
            return;
        message = message
            .replace(/\r/g, '\n')
            .replace(/\n{2,}/g, '');
        message = type === 'error'
            ? kleur_1.default.red(message)
            : kleur_1.default.gray(message);
        console.log(message);
    }
    parseMessage(buffer) {
        return trimEnd_1.default(buffer.toString(), '\n');
    }
}
// export
const m = new M();
exports.default = m.execute_.bind(m);
