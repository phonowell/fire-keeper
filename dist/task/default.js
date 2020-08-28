"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
async function main_() {
    const list = Object.keys(__1.default.task()).sort();
    __1.default.info('task', __1.default.wrapList(list));
    const name = await __1.default.prompt_({
        id: 'default-gulp',
        list,
        message: 'task',
        type: 'auto'
    });
    if (!name)
        return;
    return await __1.default.task(name)();
}
exports.default = main_;
