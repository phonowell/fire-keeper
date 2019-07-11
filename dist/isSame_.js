var $;

$ = {};

$.normalizePathToArray = require('../dist/normalizePathToArray');

$.stat_ = require('../dist/stat_');

$.info = require('../dist/info');

$.read_ = require('../dist/read_');

$.parseString = require('../dist/parseString');

module.exports = async function(source) {
  var cache, cont, i, j, len, len1, listSource, size, stat;
  // why $.normailizePathToArray, but not $.source_?
  // because source may be not existed
  listSource = $.normalizePathToArray(source);
  if (!listSource.length) {
    return false;
  }
  // size
  cache = null;
  for (i = 0, len = listSource.length; i < len; i++) {
    source = listSource[i];
    stat = (await $.stat_(source));
    if (!stat) {
      return false;
    }
    ({size} = stat);
    if (!cache) {
      cache = size;
      continue;
    }
    if (size !== cache) {
      return false;
    }
  }
  // content
  cache = null;
  for (j = 0, len1 = listSource.length; j < len1; j++) {
    source = listSource[j];
    cont = (await $.info().silence_(async function() {
      return (await $.read_(source));
    }));
    if (!cont) {
      return false;
    }
    cont = $.parseString(cont);
    if (!cache) {
      cache = cont;
      continue;
    }
    if (cont !== cache) {
      return false;
    }
  }
  return true; // return
};
