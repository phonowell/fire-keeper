(function() {
  module.exports = function($) {
    var fse, normalizePath, wrapList;
    ({normalizePath, wrapList} = $.fn);
    fse = require('fs-extra');
    
    // return
    return $.write_ = async function(source, data, option) {
      var ref;
      source = normalizePath(source);
      if ((ref = $.type(data)) === 'array' || ref === 'object') {
        data = $.parseString(data);
      }
      await fse.outputFile(source, data, option);
      $.info('file', `wrote ${wrapList(source)}`);
      return $; // return
    };
  };

}).call(this);
