var $;

$ = {};

$.source_ = require('../dist/source_');

$.info = require('../dist/info');

$.copy_ = require('../dist/copy_');

$.remove_ = require('../dist/remove_');

$.wrapList = require('../dist/wrapList');

$.parseString = require('../dist/parseString');

module.exports = async function(source, target, option) {
  var listSource, msg;
  if (!(source && target)) {
    throw new Error('move_/error: invalid argument length');
  }
  listSource = (await $.source_(source));
  if (!listSource.length) {
    return this;
  }
  await $.info().silence_(async function() {
    await $.copy_(listSource, target, option);
    return (await $.remove_(listSource));
  });
  // info
  msg = `moved ${$.wrapList(source)} to '${target}'`;
  if (option) {
    msg += `, as '${$.parseString(option)}'`;
  }
  $.info('move', msg);
  return this;
};
