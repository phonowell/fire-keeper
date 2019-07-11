var $, fse;

$ = {};

$.source_ = require('../dist/source_');

$.wrapList = require('../dist/wrapList');

$.info = require('../dist/info');

fse = require('fs-extra');

module.exports = async function(source) {
  var i, len, listSource, msg;
  listSource = (await $.source_(source));
  if (!listSource.length) {
    return this;
  }
  msg = `removed ${$.wrapList(source)}`;
  for (i = 0, len = listSource.length; i < len; i++) {
    source = listSource[i];
    await fse.remove(source);
  }
  $.info('remove', msg);
  return this;
};
