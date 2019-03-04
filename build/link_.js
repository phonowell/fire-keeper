(function() {
  module.exports = function($) {
    var fse, normalizePath, wrapList;
    ({normalizePath, wrapList} = $.fn);
    fse = require('fs-extra');
    
    // return
    return $.link_ = async function(source, target) {
      if (!(source && target)) {
        throw new Error('invalid argument length');
      }
      source = normalizePath(source);
      target = normalizePath(target);
      await fse.ensureSymlink(source, target);
      $.info('link', `linked ${wrapList(source)} to ${wrapList(target)}`);
      return $; // return
    };
  };

}).call(this);
