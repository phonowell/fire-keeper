var $;

$ = {};

$.wrapList = require('../dist/wrapList');

$.source_ = require('../dist/source_');

$.getExtname = require('../dist/getExtname');

$.info = require('../dist/info');

$.copy_ = require('../dist/copy_');

module.exports = async function(source) {
  var extname, i, len, msg, ref, suffix;
  msg = `backed up ${$.wrapList(source)}`;
  ref = (await $.source_(source));
  for (i = 0, len = ref.length; i < len; i++) {
    source = ref[i];
    suffix = $.getExtname(source);
    extname = '.bak';
    await $.info().silence_(async function() {
      return (await $.copy_(source, null, {extname, suffix}));
    });
  }
  $.info('backup', msg);
  return this;
};
