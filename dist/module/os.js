"use strict";
// interface
Object.defineProperty(exports, "__esModule", { value: true });
// variable
let cache = '';
function main(os) {
    if (!cache) {
        const string = process.platform;
        if (string.includes('darwin'))
            cache = 'macos';
        else if (string.includes('win'))
            cache = 'windows';
        else
            cache = 'unknown';
    }
    if (os)
        return os === cache;
    return cache;
}
// export
exports.default = main;
