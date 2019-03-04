(function() {
  module.exports = function($) {
    var fs;
    fs = require('fs');
    
    // return
    return $.read_ = async function(source, option = {}) {
      var extname, jsYaml, listSource, pathSource, res;
      pathSource = source;
      listSource = (await $.source_(pathSource));
      if (!(listSource != null ? listSource.length : void 0)) {
        $.info('file', `'${pathSource}' not existed`);
        return null;
      }
      source = listSource[0];
      res = (await new Promise(function(resolve) {
        return fs.readFile(source, function(err, data) {
          if (err) {
            throw err;
          }
          return resolve(data);
        });
      }));
      $.info('file', `read '${source}'`);
      
      // return
      if (option.raw) {
        return res;
      }
      extname = $.getExtname(source);
      if (extname === '.coffee' || extname === '.css' || extname === '.html' || extname === '.js' || extname === '.md' || extname === '.pug' || extname === '.sh' || extname === '.styl' || extname === '.txt' || extname === '.xml') {
        return $.parseString(res);
      }
      if (extname === '.json') {
        return $.parseJSON(res);
      }
      if (extname === '.yaml' || extname === '.yml') {
        jsYaml = require('js-yaml');
        return jsYaml.safeLoad(res);
      }
      return res; // return
    };
  };

}).call(this);
