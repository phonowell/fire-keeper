var path;

path = require('path');

module.exports = function(source) {
  var basename, dirname, extname, filename;
  if (!((source != null ? source.length : void 0) || source > 0)) {
    throw new Error(`getName/error: invalid source '${source}'`);
  }
  source = source.replace(/\\/g, '/');
  extname = path.extname(source);
  basename = path.basename(source, extname);
  dirname = path.dirname(source);
  filename = `${basename}${extname}`;
  // return
  return {basename, dirname, extname, filename};
};
