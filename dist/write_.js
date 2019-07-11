var $, fse;

$ = {};

$.normalizePath = require('../dist/normalizePath');

$.type = require('../dist/type');

$.parseString = require('../dist/parseString');

$.info = require('../dist/info');

$.wrapList = require('../dist/wrapList');

fse = require('fs-extra');

module.exports = async function(source, data, option) {
  var ref;
  source = $.normalizePath(source);
  if ((ref = $.type(data)) === 'array' || ref === 'object') {
    data = $.parseString(data);
  }
  await fse.outputFile(source, data, option);
  $.info('file', `wrote ${$.wrapList(source)}`);
  return this;
};
