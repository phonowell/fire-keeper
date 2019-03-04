(function() {
  module.exports = function($) {
    /*
    clean_(source)
    */
    return $.clean_ = async function(source) {
      var listSource, pathDir, type;
      type = $.type(source);
      if (type !== 'string') {
        throw new Error(`invalid type '${type}'`);
      }
      await $.remove_(source);
      pathDir = $.getDirname(source);
      listSource = (await $.source_(`${pathDir}/**/*`));
      if (listSource.length) {
        return $;
      }
      await $.remove_(pathDir);
      return $; // return
    };
  };

}).call(this);
