var $, fs;

$ = {};

$.source_ = require('../dist/source_');

$.info = require('../dist/info');

$.getExtname = require('../dist/getExtname');

$.parseString = require('../dist/parseString');

$.parseJson = require('../dist/parseJson');

fs = require('fs');

module.exports = async function(source, option = {}) {
  var _source, extname, jsYaml, listSource, result;
  _source = source;
  listSource = (await $.source_(source));
  if (!listSource.length) {
    $.info('file', `'${source}' not existed`);
    return null;
  }
  source = listSource[0];
  result = (await new Promise(function(resolve) {
    return fs.readFile(source, function(err, data) {
      if (err) {
        throw new Error(err);
      }
      return resolve(data);
    });
  }));
  $.info('file', `read '${_source}'`);
  // return
  if (option.raw) {
    return result;
  }
  extname = $.getExtname(source);
  if (extname === '.coffee' || extname === '.css' || extname === '.html' || extname === '.js' || extname === '.md' || extname === '.pug' || extname === '.sh' || extname === '.styl' || extname === '.txt' || extname === '.xml') {
    return $.parseString(result);
  }
  if (extname === '.json') {
    return $.parseJson(result);
  }
  if (extname === '.yaml' || extname === '.yml') {
    jsYaml = require('js-yaml');
    return jsYaml.safeLoad(result);
  }
  return result; // return
};
