var $;

$ = {};

$.type = require('../dist/type');

module.exports = function(ipt) {
  var type;
  switch (type = $.type(ipt)) {
    case 'array':
    case 'object':
      return ipt;
    case 'string':
    case 'uint8array':
      return JSON.parse(ipt);
    default:
      throw new Error(`parseJson/error: invalid type '${type}'`);
  }
};
