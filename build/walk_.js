(function() {
  module.exports = function($) {
    var _, normalizePath;
    ({_} = $);
    ({normalizePath} = $.fn);
    // https://github.com/jprichardson/node-klaw

    // path = require 'path'

    // return
    return $.walk_ = async function(source, callback) {
      if (!(source && callback)) {
        throw new Error('invalid argument length');
      }
      source = normalizePath(source);
      await new Promise(function(resolve) {
        var walk;
        
        // require
        walk = require('klaw');
        return walk(source).on('data', function(item) {
          return callback(_.merge(item, {
            path: normalizePath(item.path)
          }));
        }).on('end', function() {
          return resolve();
        });
      });
      return $; // return
    };
  };

}).call(this);
