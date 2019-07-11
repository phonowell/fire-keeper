var $;

$ = {};

$.wrapList = require('../dist/wrapList');

$.normalizePathToArray = require('../dist/normalizePathToArray');

$.isExisted_ = require('../dist/isExisted_');

$.info = require('../dist/info');

$.getFilename = require('../dist/getFilename');

$.remove_ = require('../dist/remove_');

$.copy_ = require('../dist/copy_');

module.exports = async function(source) {
  var filename, i, len, msg, pathBak, ref;
  msg = `recovered ${$.wrapList(source)}`;
  ref = $.normalizePathToArray(source);
  for (i = 0, len = ref.length; i < len; i++) {
    source = ref[i];
    pathBak = `${source}.bak`;
    if (!(await $.isExisted_(pathBak))) {
      $.info('recover', `'${pathBak}' not found`);
      continue;
    }
    filename = $.getFilename(source);
    await $.info().silence_(async function() {
      await $.remove_(source);
      await $.copy_(pathBak, null, filename);
      return (await $.remove_(pathBak));
    });
  }
  $.info('recover', msg);
  return this;
};
