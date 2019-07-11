var $;

$ = {};

$.normalizePath = require('../dist/normalizePath');

module.exports = function(source) {
  return require($.normalizePath(source));
};
