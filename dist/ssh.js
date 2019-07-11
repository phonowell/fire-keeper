var $, M, _, kleur, path;

$ = {};

$.info = require('../dist/info');

$.formatArgument = require('../dist/formatArgument');

$.parseString = require('../dist/parseString');

$.i = require('../dist/i');

$.wrapList = require('../dist/wrapList');

$.normalizePathToArray = require('../dist/normalizePathToArray');

$.type = require('../dist/type');

$.stat_ = require('../dist/stat_');

$.walk_ = require('../dist/walk_');

_ = {};

_.trim = require('lodash/trim');

_.clone = require('lodash/clone');

// https://github.com/mscdex/ssh2
kleur = require('kleur');

path = require('path');

M = class M {
  /*
  connect_(option)
  disconnect_()
  exec_(cmd, [option])
  info(chunk)
  mkdir_(source)
  remove_(source)
  uploadDir_(sftp, source, target)
  uploadFile_(sftp, source, target)
  upload_(source, target, [option])
  */
  async connect_(option) {
    await new Promise((resolve) => {
      var Client, conn, infoServer;
      ({Client} = require('ssh2'));
      conn = new Client();
      infoServer = `${option.username}@${option.host}`;
      conn.on('end', function() {
        return $.info('ssh', `disconnected from '${infoServer}'`);
      }).on('error', function(err) {
        throw new Error(err);
      }).on('ready', function() {
        $.info('ssh', `connected to '${infoServer}'`);
        return resolve();
      }).connect(option);
      return this.storage = {conn, option};
    });
    return this;
  }

  async disconnect_() {
    await new Promise((resolve) => {
      var conn;
      ({conn} = this.storage);
      return conn.on('end', function() {
        return resolve();
      }).end();
    });
    return this;
  }

  async exec_(cmd, option = {}) {
    await new Promise((resolve) => {
      var conn;
      ({conn} = this.storage);
      cmd = $.formatArgument(cmd);
      cmd = cmd.join(' && ');
      $.info('ssh', kleur.blue(cmd));
      return conn.exec(cmd, (err, stream) => {
        if (err) {
          throw new Error(err);
        }
        stream.on('end', function() {
          return resolve();
        });
        stream.stderr.on('data', (chunk) => {
          if (option.ignoreError) {
            return this.info(chunk);
          }
          throw new Error($.parseString(chunk));
        });
        return stream.stdout.on('data', (chunk) => {
          return this.info(chunk);
        });
      });
    });
    return this;
  }

  info(chunk) {
    var string;
    string = _.trim($.parseString(chunk));
    if (!string.length) {
      return;
    }
    string = string.replace(/\r/g, '\n').replace(/\n{2,}/g, '');
    return $.i(string);
  }

  mkdir_(source) {
    var cmd, src;
    source = $.formatArgument(source);
    cmd = ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = source.length; i < len; i++) {
        src = source[i];
        results.push(`mkdir -p ${src}`);
      }
      return results;
    })()).join('; ');
    $.info().silence_(async() => {
      return (await this.exec_(cmd));
    });
    $.info('ssh', `created ${$.wrapList(source)}`);
    return this;
  }

  remove_(source) {
    var cmd, src;
    source = $.formatArgument(source);
    cmd = ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = source.length; i < len; i++) {
        src = source[i];
        results.push(`rm -fr ${src}`);
      }
      return results;
    })()).join('; ');
    $.info().silence_(async() => {
      return (await this.exec_(cmd));
    });
    $.info('ssh', `removed ${$.wrapList(source)}`);
    return this;
  }

  async upload_(source, target, option = {}) {
    await new Promise((resolve) => {
      var conn;
      ({conn} = this.storage);
      source = $.normalizePathToArray(source);
      option = (function() {
        switch ($.type(option)) {
          case 'object':
            return _.clone(option);
          case 'string':
            return {
              filename: option
            };
          default:
            throw new Error('ssh/error: invalid type');
        }
      })();
      return conn.sftp(async(err, sftp) => {
        var filename, i, len, src, stat;
        if (err) {
          throw new Error(err);
        }
        for (i = 0, len = source.length; i < len; i++) {
          src = source[i];
          stat = (await $.stat_(src));
          filename = option.filename || path.basename(src);
          if (stat.isDirectory()) {
            await this.uploadDir_(sftp, src, `${target}/${filename}`);
          } else if (stat.isFile()) {
            await this.mkdir_(target);
            await this.uploadFile_(sftp, src, `${target}/${filename}`);
          }
        }
        sftp.end();
        return resolve();
      });
    });
    return this;
  }

  async uploadDir_(sftp, source, target) {
    await new Promise(async(resolve) => {
      var i, len, listSource, relativeTarget, src, stat;
      listSource = [];
      await $.walk_(source, function(item) {
        return listSource.push(item.path);
      });
      for (i = 0, len = listSource.length; i < len; i++) {
        src = listSource[i];
        stat = (await $.stat_(src));
        relativeTarget = path.normalize(`${target}/${path.relative(source, src)}`);
        if (stat.isDirectory()) {
          await this.mkdir_(relativeTarget);
        } else if (stat.isFile()) {
          await this.uploadFile_(sftp, src, relativeTarget);
        }
      }
      return resolve();
    });
    return this;
  }

  async uploadFile_(sftp, source, target) {
    await new Promise(function(resolve) {
      return sftp.fastPut(source, target, function(err) {
        if (err) {
          throw new Error(err);
        }
        $.info('ssh', `uploaded '${source}' to '${target}'`);
        return resolve();
      });
    });
    return this;
  }

};

module.exports = function() {
  return new M();
};
