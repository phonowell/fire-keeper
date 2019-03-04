(function() {
  module.exports = function($) {
    var normalizePathToArray;
    ({normalizePathToArray} = $.fn);
    return $.isSame_ = async function(source) {
      var cache, cont, groupSource, i, j, len, len1, size, stat;
      groupSource = normalizePathToArray(source);
      if (!groupSource.length) {
        return false;
      }
      
      // check size
      cache = null;
      for (i = 0, len = groupSource.length; i < len; i++) {
        source = groupSource[i];
        stat = (await $.stat_(source));
        if (!stat) {
          return false;
        }
        ({size} = stat);
        if (!cache) {
          cache = size;
          continue;
        }
        if (size !== cache) {
          return false;
        }
      }
      
      // check content
      cache = null;
      for (j = 0, len1 = groupSource.length; j < len1; j++) {
        source = groupSource[j];
        $.info.pause('$.isSame_');
        cont = (await $.read_(source));
        $.info.resume('$.isSame_');
        if (!cont) {
          return false;
        }
        cont = $.parseString(cont);
        if (!cache) {
          cache = cont;
          continue;
        }
        if (cont !== cache) {
          return false;
        }
      }
      return true; // return
    };
  };

}).call(this);
