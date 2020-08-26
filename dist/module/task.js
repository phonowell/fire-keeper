"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_1 = __importDefault(require("gulp"));
// function
class M {
    add(name, fn) {
        gulp_1.default.task(name, fn);
    }
    execute(name, fn) {
        if (!name)
            return this.get();
        if (!fn)
            return this.get(name);
        this.add(name, fn);
    }
    get(name) {
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
}
// export
const m = new M();
exports.default = m.execute.bind(m);
