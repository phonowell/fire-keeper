var $, fse;

$ = {};

$.normalizePathToArray = require('../dist/normalizePathToArray');

$.info = require('../dist/info');

$.wrapList = require('../dist/wrapList');

fse = require('fs-extra');

module.exports = async function(source) {
  var listPromise, src;
  if (!source) {
    throw new Error('mkdir_/error: invalid source');
  }
  source = $.normalizePathToArray(source);
  listPromise = (function() {
    var i, len, results;
    results = [];
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      results.push(fse.ensureDir(src));
    }
    return results;
  })();
  await Promise.all(listPromise);
  $.info('create', `created ${$.wrapList(source)}`);
  return this;
};
