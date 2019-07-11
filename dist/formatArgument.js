var $, _;

$ = {};

$.type = require('../dist/type');

_ = {};

_.clone = require('lodash/clone');

module.exports = function(arg) {
  var type;
  switch (type = $.type(arg)) {
    case 'array':
      return _.clone(arg);
    case 'boolean':
    case 'number':
    case 'string':
      return [arg];
    default:
      throw new Error(`formatArgument/error: invalid type '${type}'`);
  }
};
