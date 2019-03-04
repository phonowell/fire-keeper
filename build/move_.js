(function() {
  module.exports = function($) {
    var wrapList;
    ({wrapList} = $.fn);
    return $.move_ = async function(source, target) {
      var listSource;
      if (!(source && target)) {
        throw new Error('invalid argument length');
      }
      listSource = (await $.source_(source));
      if (!listSource.length) {
        return $;
      }
      $.info.pause('$.move_');
      await $.copy_(listSource, target);
      await $.remove_(listSource);
      $.info.resume('$.move_');
      $.info('move', `moved ${wrapList(source)} to '${target}'`);
      return $; // return
    };
  };

}).call(this);
