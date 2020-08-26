"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
// function
function main(input) {
    if (typeof input === 'string')
        return input;
    if (input instanceof Array)
        return (JSON.stringify({ __container__: input }))
            .replace(/{(.*)}/, '$1')
            .replace(/"__container__":/, '');
    if (__1.default.type(input) === 'object')
        return JSON.stringify(input);
    if (input && input.toString)
        return input.toString();
    return String(input);
}
// export
exports.default = main;
