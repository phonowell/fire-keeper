"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
function main(source) {
    return __1.default.formatArgument(source)
        .map(it => __1.default.normalizePath(it));
}
exports.default = main;
