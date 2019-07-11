var $, fs;

$ = {};

$.normalizePath = require('../dist/normalizePath');

$.isExisted_ = require('../dist/isExisted_');

$.info = require('../dist/info');

$.wrapList = require('../dist/wrapList');

fs = require('fs');

module.exports = async function(source) {
  source = $.normalizePath(source);
  if (!(await $.isExisted_(source))) {
    $.info('file', `${$.wrapList(source)} not existed`);
    return null;
  }
  // return
  return new Promise(function(resolve) {
    return fs.stat(source, function(err, stat) {
      if (err) {
        throw new Error(err);
      }
      return resolve(stat);
    });
  });
};
