var $, walk;

$ = {};

$.normalizePath = require('../dist/normalizePath');

walk = require('klaw');

module.exports = async function(source, callback) {
  if (!(source && callback)) {
    throw new Error('walk_/error: invalid argument length');
  }
  source = $.normalizePath(source);
  await new Promise(function(resolve) {
    return walk(source).on('data', function(item) {
      return callback(Object.assign(item, {
        path: $.normalizePath(item.path)
      }));
    }).on('end', function() {
      return resolve();
    });
  });
  return this;
};
