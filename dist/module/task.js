"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_1 = __importDefault(require("gulp"));
function add(name, fn) {
    gulp_1.default.task(name, fn);
}
function get(name) {
    const map = gulp_1.default._registry._tasks;
    if (!name) {
        const result = {};
        for (const name of Object.keys(map))
            result[name] = map[name].unwrap();
        return result;
    }
    const result = map[name];
    if (!result)
        throw new Error(`task/error: invalid task '${name}'`);
    return result.unwrap();
}
function main(name, fn) {
    if (!name)
        return get();
    if (!fn)
        return get(name);
    add(name, fn);
}
exports.default = main;
