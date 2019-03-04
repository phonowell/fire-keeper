(function() {
  module.exports = function($) {
    var wrapList;
    ({wrapList} = $.fn);
    // return
    return $.backup_ = async function(source) {
      var extname, i, len, listSource, msg, suffix;
      listSource = (await $.source_(source));
      msg = `backed up ${wrapList(source)}`;
      for (i = 0, len = listSource.length; i < len; i++) {
        source = listSource[i];
        suffix = $.getExtname(source);
        extname = '.bak';
        $.info.pause('$.backup_');
        await $.copy_(source, null, {suffix, extname});
        $.info.resume('$.backup_');
      }
      $.info('backup', msg);
      return $; // return
    };
  };

}).call(this);
