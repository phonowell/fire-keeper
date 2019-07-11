var $, fse;

$ = {};

$.normalizePath = require('../dist/normalizePath');

$.info = require('../dist/info');

$.wrapList = require('../dist/wrapList');

fse = require('fs-extra');

module.exports = async function(source, target) {
  if (!(source && target)) {
    throw new Error('link_/error: invalid argument length');
  }
  source = $.normalizePath(source);
  target = $.normalizePath(target);
  await fse.ensureSymlink(source, target);
  $.info('link', `linked ${$.wrapList(source)} to ${$.wrapList(target)}`);
  return this;
};
