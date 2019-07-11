var $;

$ = {};

$.normalizePath = require('../dist/normalizePath');

$.type = require('../dist/type');

$.wrapList = require('../dist/wrapList');

$.parseString = require('../dist/parseString');

$.info = require('../dist/info');

// https://github.com/kevva/download
module.exports = async function(...arg) {
  var download, msg, option, source, target;
  [source, target, option] = (function() {
    switch (arg.length) {
      case 2:
        return [arg[0], arg[1], null];
      case 3:
        return arg;
      default:
        throw new Error('download_/error: invalid argument length');
    }
  })();
  target = $.normalizePath(target);
  if (($.type(option)) === 'string') {
    option = {
      filename: option
    };
  }
  // this function download was from plugin
  download = require('download');
  await download(source, target, option);
  msg = `downloaded ${$.wrapList(source)} to ${$.wrapList(target)}`;
  if (option) {
    msg += `, as '${$.parseString(option)}'`;
  }
  $.info('download', msg);
  return this;
};
