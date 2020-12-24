"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
async function main_(delay = 0) {
    await new Promise(resolve => setTimeout(() => resolve(true), delay));
    if (delay)
        __1.default.info('sleep', `slept '${delay} ms'`);
}
exports.default = main_;
