(function() {
  module.exports = function($) {
    var fse, wrapList;
    ({wrapList} = $.fn);
    fse = require('fs-extra');
    
    // return
    return $.remove_ = async function(source) {
      var i, len, listSource, msg;
      listSource = (await $.source_(source));
      if (!listSource.length) {
        return $;
      }
      msg = `removed ${wrapList(source)}`;
      for (i = 0, len = listSource.length; i < len; i++) {
        source = listSource[i];
        await fse.remove(source);
      }
      $.info('remove', msg);
      return $; // return
    };
  };

}).call(this);
