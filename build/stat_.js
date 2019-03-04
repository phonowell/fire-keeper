(function() {
  module.exports = function($) {
    var fs, normalizePath, wrapList;
    ({normalizePath, wrapList} = $.fn);
    fs = require('fs');
    
    // return
    return $.stat_ = async function(source) {
      source = normalizePath(source);
      if (!(await $.isExisted_(source))) {
        $.info('file', `${wrapList(source)} not existed`);
        return null;
      }
      
      // return
      return new Promise(function(resolve) {
        return fs.stat(source, function(err, stat) {
          if (err) {
            throw err;
          }
          return resolve(stat);
        });
      });
    };
  };

}).call(this);
