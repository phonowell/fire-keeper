(function() {
  module.exports = function($) {
    var SSH, _, formatArgument, kleur, normalizePathToArray, path, wrapList;
    ({_} = $);
    ({formatArgument, normalizePathToArray, wrapList} = $.fn);
    // https://github.com/mscdex/ssh2
    kleur = require('kleur');
    path = require('path');
    SSH = class SSH {
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
            throw err;
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
          cmd = formatArgument(cmd);
          cmd = cmd.join(' && ');
          $.info('ssh', kleur.blue(cmd));
          return conn.exec(cmd, (err, stream) => {
            if (err) {
              throw err;
            }
            stream.on('end', function() {
              return resolve();
            });
            stream.stderr.on('data', (chunk) => {
              if (option.ignoreError) {
                return this.info(chunk);
              }
              throw $.parseString(chunk);
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
        string = $.trim($.parseString(chunk));
        if (!string.length) {
          return;
        }
        string = string.replace(/\r/g, '\n').replace(/\n{2,}/g, '');
        return $.i(string);
      }

      async mkdir_(source) {
        var cmd, src;
        source = formatArgument(source);
        cmd = ((function() {
          var i, len, results;
          results = [];
          for (i = 0, len = source.length; i < len; i++) {
            src = source[i];
            results.push(`mkdir -p ${src}`);
          }
          return results;
        })()).join('; ');
        $.info.pause('$.ssh.mkdir_');
        await this.exec_(cmd);
        $.info.resume('$.ssh.mkdir_');
        $.info('ssh', `created ${wrapList(source)}`);
        return this;
      }

      async remove_(source) {
        var cmd, src;
        source = formatArgument(source);
        cmd = ((function() {
          var i, len, results;
          results = [];
          for (i = 0, len = source.length; i < len; i++) {
            src = source[i];
            results.push(`rm -fr ${src}`);
          }
          return results;
        })()).join('; ');
        $.info.pause('$.ssh.remove_');
        await this.exec_(cmd);
        $.info.resume('$.ssh.remove_');
        $.info('ssh', `removed ${wrapList(source)}`);
        return this;
      }

      async upload_(source, target, option = {}) {
        await new Promise((resolve) => {
          var conn;
          ({conn} = this.storage);
          source = normalizePathToArray(source);
          option = (function() {
            switch ($.type(option)) {
              case 'object':
                return _.clone(option);
              case 'string':
                return {
                  filename: option
                };
              default:
                throw new Error('invalid type');
            }
          })();
          return conn.sftp(async(err, sftp) => {
            var filename, i, len, src, stat;
            if (err) {
              throw err;
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
              throw err;
            }
            $.info('ssh', `uploaded '${source}' to '${target}'`);
            return resolve();
          });
        });
        return this;
      }

    };
    
    // return
    return $.ssh = function() {
      var i, key, len, listKey, ssh;
      ssh = new SSH();
      
      // rename
      listKey = ['connect', 'disconnect', 'exec', 'mkdir', 'remove', 'upload', 'uploadDir', 'uploadFile'];
      for (i = 0, len = listKey.length; i < len; i++) {
        key = listKey[i];
        ssh[`${key}Async`] = ssh[`${key}_`];
      }
      return ssh; // return
    };
  };

}).call(this);
