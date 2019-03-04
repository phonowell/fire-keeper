(function() {
  module.exports = function($) {
    var fse, normalizePathToArray, wrapList;
    ({normalizePathToArray, wrapList} = $.fn);
    fse = require('fs-extra');
    
    // return
    return $.mkdir_ = async function(source) {
      var listPromise, src;
      if (!source) {
        throw new Error('invalid source');
      }
      source = normalizePathToArray(source);
      listPromise = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = source.length; i < len; i++) {
          src = source[i];
          results.push(fse.ensureDir(src));
        }
        return results;
      })();
      await Promise.all(listPromise);
      $.info('create', `created ${wrapList(source)}`);
      return $; // return
    };
  };

}).call(this);
