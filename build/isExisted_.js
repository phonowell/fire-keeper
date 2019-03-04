(function() {
  module.exports = function($) {
    var fse, normalizePathToArray;
    ({normalizePathToArray} = $.fn);
    fse = require('fs-extra');
    
    // return
    return $.isExisted_ = async function(source) {
      var groupSource, i, isExisted, len;
      groupSource = normalizePathToArray(source);
      if (!groupSource.length) {
        return false;
      }
      for (i = 0, len = groupSource.length; i < len; i++) {
        source = groupSource[i];
        isExisted = (await fse.pathExists(source));
        if (!isExisted) {
          return false;
        }
      }
      return true; // return
    };
  };

}).call(this);
