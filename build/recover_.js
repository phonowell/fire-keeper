(function() {
  module.exports = function($) {
    var normalizePathToArray, wrapList;
    ({normalizePathToArray, wrapList} = $.fn);
    // return
    return $.recover_ = async function(source) {
      var filename, groupSource, i, len, msg, pathBak;
      groupSource = normalizePathToArray(source);
      msg = `recovered ${wrapList(source)}`;
      for (i = 0, len = groupSource.length; i < len; i++) {
        source = groupSource[i];
        pathBak = `${source}.bak`;
        if (!(await $.isExisted_(pathBak))) {
          $.info('recover', `'${pathBak}' not found`);
          continue;
        }
        filename = $.getFilename(source);
        $.info.pause('$.recover_');
        await $.chain($).remove_(source).copy_(pathBak, null, filename).remove_(pathBak);
        $.info.resume('$.recover_');
      }
      $.info('recover', msg);
      return $; // return
    };
  };

}).call(this);
