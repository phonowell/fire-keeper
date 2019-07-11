var $;

$ = {};

$.formatArgument = require('../dist/formatArgument');

$.normalizePath = require('../dist/normalizePath');

module.exports = function(source) {
  var groupSource, i, len, results;
  groupSource = $.formatArgument(source);
  results = [];
  for (i = 0, len = groupSource.length; i < len; i++) {
    source = groupSource[i];
    results.push($.normalizePath(source));
  }
  return results;
};
