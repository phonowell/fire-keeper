"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// function
const yargs_1 = __importDefault(require("yargs"));
// function
function main() {
    return yargs_1.default.argv;
}
// export
exports.default = main;
