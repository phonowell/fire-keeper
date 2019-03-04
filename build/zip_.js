(function() {
  module.exports = function($) {
    var _, fs, kleur, normalizePath, normalizePathToArray, path, wrapList;
    ({_} = $);
    ({normalizePath, normalizePathToArray, wrapList} = $.fn);
    fs = require('fs');
    kleur = require('kleur');
    path = require('path');
    
    // return
    return $.zip_ = async function(...arg) {
      var _source, base, filename, isSilent, option, source, target;
      [source, target, option] = arg;
      _source = source;
      source = normalizePathToArray(source);
      target || (target = $.getDirname(source[0]).replace(/\*/g, ''));
      target = normalizePath(target);
      [base, filename, isSilent] = (function() {
        switch ($.type(option)) {
          case 'object':
            return [option.base, option.filename, option.silent || option.isSilent];
          case 'string':
            return [null, option, false];
          default:
            return [null, null, false];
        }
      })();
      base || (base = (function() {
        _source = (function() {
          switch ($.type(_source)) {
            case 'array':
              return _source[0];
            case 'string':
              return _source;
            default:
              throw new Error('invalid type');
          }
        })();
        if (~_source.search(/\*/)) {
          return _.trim(_source.replace(/\*.*/, ''), '/');
        }
        return path.dirname(_source);
      })());
      base = normalizePath(base);
      filename || (filename = `${$.getBasename(target)}.zip`);
      await new Promise(async function(resolve) {
        var ansi, archive, archiver, i, len, listSource, msg, name, output, src;
        
        // require
        ansi = require('sisteransi');
        archiver = require('archiver');
        output = fs.createWriteStream(`${target}/${filename}`);
        archive = archiver('zip', {
          zlib: {
            level: 9
          }
        });
        archive.on('warning', function(err) {
          throw err;
        });
        archive.on('error', function(err) {
          throw err;
        });
        msg = null;
        archive.on('entry', function(e) {
          if (isSilent) {
            return;
          }
          return msg = $.info.renderPath(e.sourcePath);
        });
        archive.on('progress', function(e) {
          var gray, magenta;
          if (isSilent) {
            return;
          }
          if (!msg) {
            return;
          }
          gray = kleur.gray(`${Math.floor(e.fs.processedBytes * 100 / e.fs.totalBytes)}%`);
          magenta = kleur.magenta(msg);
          msg = `${gray} ${magenta}`;
          $.i([ansi.erase.line, msg, ansi.cursor.up()].join(''));
          return msg = null;
        });
        archive.on('end', function() {
          return resolve();
        });
        archive.pipe(output);
        listSource = (await $.source_(source));
        for (i = 0, len = listSource.length; i < len; i++) {
          src = listSource[i];
          name = src.replace(base, '');
          archive.file(src, {name});
        }
        return archive.finalize();
      });
      $.info('zip', `zipped ${wrapList(source)} to '${target}', named as '${filename}'`);
      return $; // return
    };
  };

}).call(this);
