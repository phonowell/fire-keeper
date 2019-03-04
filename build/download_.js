(function() {
  module.exports = function($) {
    var normalizePath, wrapList;
    ({normalizePath, wrapList} = $.fn);
    // https://github.com/kevva/download
    /*
    download_(source, target, [option])
    */
    return $.download_ = async function(...arg) {
      var download, msg, option, source, target;
      [source, target, option] = (function() {
        switch (arg.length) {
          case 2:
            return [arg[0], arg[1], null];
          case 3:
            return arg;
          default:
            throw new Error('invalid argument length');
        }
      })();
      target = normalizePath(target);
      if ($.type(option) === 'string') {
        option = {
          filename: option
        };
      }
      
      // this function download was from plugin
      download = require('download');
      await download(source, target, option);
      msg = `downloaded ${wrapList(source)} to ${wrapList(target)}`;
      if (option) {
        msg += `, as '${$.parseString(option)}'`;
      }
      $.info('download', msg);
      return $; // return
    };
  };

}).call(this);
