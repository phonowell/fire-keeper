var $, M, _, archiver, fs, kleur, ora;

$ = {};

$.info = require('../dist/info');

$.source_ = require('../dist/source_');

$.normalizePathToArray = require('../dist/normalizePathToArray');

$.getDirname = require('../dist/getDirname');

$.normalizePath = require('../dist/normalizePath');

$.getBasename = require('../dist/getBasename');

$.wrapList = require('../dist/wrapList');

$.type = require('../dist/type');

_ = {};

_.trim = require('lodash/trim');

archiver = require('archiver');

fs = require('fs');

kleur = require('kleur');

ora = require('ora');

M = class M {
  /*
  ---
  archive_(option)
  execute_(arg...)
  getBase(source)
  getOption(option)
  */
  async archive_(option) {
    var base, filename, source, spinner, target;
    ({base, filename, source, target} = option);
    spinner = ora().start();
    await new Promise(async function(resolve) {
      var archive, i, len, msg, name, output, ref;
      output = fs.createWriteStream(`${target}/${filename}`);
      archive = archiver('zip', {
        zlib: {
          level: 9
        }
      });
      msg = null;
      /*
      end
      entry
      error
      progress
      warning
      */
      archive.on('end', function() {
        spinner.succeed();
        return resolve();
      });
      archive.on('entry', function(e) {
        return msg = $.info().renderPath(e.sourcePath);
      });
      archive.on('error', function(e) {
        spinner.fail(e.message);
        throw new Error(e.message);
      });
      archive.on('progress', function(e) {
        var gray, magenta;
        if (!msg) {
          return;
        }
        gray = kleur.gray(`${Math.floor(e.fs.processedBytes * 100 / e.fs.totalBytes)}%`);
        magenta = kleur.magenta(msg);
        msg = `${gray} ${magenta}`;
        spinner.text = msg;
        return msg = null;
      });
      archive.on('warning', function(e) {
        spinner.warn(e.message);
        throw new Error(e.message);
      });
      // execute
      archive.pipe(output);
      ref = (await $.source_(source));
      for (i = 0, len = ref.length; i < len; i++) {
        source = ref[i];
        name = source.replace(base, '');
        archive.file(source, {name});
      }
      return archive.finalize();
    });
    return this;
  }

  async execute_(source, target, option) {
    var _source, base, filename;
    _source = source;
    source = $.normalizePathToArray(source);
    target || (target = $.getDirname(source[0]).replace(/\*/g, ''));
    target = $.normalizePath(target);
    [base, filename] = this.getOption(option);
    base = $.normalizePath(base || this.getBase(_source));
    filename || (filename = `${$.getBasename(target)}.zip`);
    await this.archive_({base, filename, source, target});
    $.info('zip', `zipped ${$.wrapList(source)} to '${target}', named as '${filename}'`);
    return this;
  }

  getBase(source) {
    var type;
    type = $.type(source);
    source = (function() {
      switch (type) {
        case 'array':
          return source[0];
        case 'string':
          return source;
        default:
          throw new Error(`zip_/error: invalid type '${type}'`);
      }
    })();
    if (source.includes('*')) {
      return _.trim(source.replace(/\*.*/, ''), '/');
    }
    return $.getDirname(source); // return
  }

  getOption(option) {
    var type;
    type = $.type(option);
    switch (type) {
      case 'object':
        return [option.base, option.filename];
      case 'string':
        return [null, option];
      default:
        return [null, null];
    }
  }

};

module.exports = async function(...arg) {
  var m;
  m = new M();
  await m.execute_(...arg);
  return this;
};
