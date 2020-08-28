"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function main(input) {
    return Object.prototype.toString.call(input)
        .replace(/^\[object (.+)]$/, '$1')
        .toLowerCase();
}
exports.default = main;
