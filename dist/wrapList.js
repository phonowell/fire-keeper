var $;

$ = {};

$.formatArgument = require('../dist/formatArgument');

module.exports = function(list) {
  var key;
  if (list == null) {
    return '';
  }
  list = $.formatArgument(list);
  return ((function() {
    var i, len, results;
    results = [];
    for (i = 0, len = list.length; i < len; i++) {
      key = list[i];
      results.push(`'${key}'`);
    }
    return results;
  })()).join(', ');
};
