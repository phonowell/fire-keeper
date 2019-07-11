var $;

$ = {};

$.source_ = require('../dist/source_');

$.info = require('../dist/info');

$.copy_ = require('../dist/copy_');

$.remove_ = require('../dist/remove_');

$.wrapList = require('../dist/wrapList');

module.exports = async function(source, target) {
  var listSource;
  if (!(source && target)) {
    throw new Error('move_/error: invalid argument length');
  }
  listSource = (await $.source_(source));
  if (!listSource.length) {
    return this;
  }
  await $.info().silence_(async function() {
    await $.copy_(listSource, target);
    return (await $.remove_(listSource));
  });
  $.info('move', `moved ${$.wrapList(source)} to '${target}'`);
  return this;
};
