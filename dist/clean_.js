var $;

$ = {};

$.type = require('../dist/type');

$.remove_ = require('../dist/remove_');

$.getDirname = require('../dist/getDirname');

$.source_ = require('../dist/source_');

module.exports = async function(source) {
  var dirname, listSource, type;
  type = $.type(source);
  if (type !== 'string') {
    throw new Error(`clean_/error: invalid type '${type}'`);
  }
  await $.remove_(source);
  dirname = $.getDirname(source);
  listSource = (await $.source_(`${dirname}/**/*`));
  if (listSource.length) {
    return this;
  }
  await $.remove_(dirname);
  return this;
};
