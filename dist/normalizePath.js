var $, _, path;

$ = {};

$.type = require('../dist/type');

$.root = require('../dist/root');

$.home = require('../dist/home');

_ = {};

_.trimEnd = require('lodash/trimEnd');

path = require('path');

module.exports = function(string) {
  var isIgnore;
  if ('string' !== $.type(string)) {
    return null;
  }
  // check isIgnore
  if (string[0] === '!') {
    isIgnore = true;
    string = string.slice(1);
  }
  // replace . & ~
  string = string.replace(/\.{2}/g, '__parent_directory__');
  string = (function() {
    switch (string[0]) {
      case '.':
        return string.replace(/\./, $.root());
      case '~':
        return string.replace(/~/, $.home());
      default:
        return string;
    }
  })();
  string = string.replace(/__parent_directory__/g, '..');
  // replace ../ to ./../ at start
  if (string[0] === '.' && string[1] === '.') {
    string = `${$.root()}/${string}`;
  }
  // normalize
  string = path.normalize(string).replace(/\\/g, '/');
  // absolute
  if (!path.isAbsolute(string)) {
    string = `${$.root()}/${string}`;
  }
  // ignore
  if (isIgnore) {
    string = `!${string}`;
  }
  // return
  return _.trimEnd(string, '/');
};
