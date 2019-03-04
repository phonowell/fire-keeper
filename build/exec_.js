(function() {
  module.exports = function($) {
    var M, _, kleur;
    ({_} = $);
    kleur = require('kleur');
    M = (function() {
      class M {
        /*
        close()
        execute_(cmd, [option])
        info([type], string)
        parseMessage(buffer)
        */
        close() {
          this.process.kill();
          return this;
        }

        async execute_(cmd, option = {}) {
          var arg, cmder, isIgnoreError, isSilent, result, status, type;
          type = $.type(cmd);
          cmd = (function() {
            switch (type) {
              case 'array':
                return cmd.join(' && ');
              case 'string':
                return cmd;
              default:
                throw new Error(`invalid type '${type}'`);
            }
          })();
          isIgnoreError = !!option.ignoreError;
          delete option.ignoreError;
          isSilent = !!option.silent;
          delete option.silent;
          [cmder, arg] = $.os === 'windows' ? ['cmd.exe', ['/s', '/c', cmd]] : ['/bin/sh', ['-c', cmd]];
          if (!isSilent) {
            $.info('exec', cmd);
          }
          [status, result] = (await new Promise((resolve) => {
            var res;
            res = null;
            this.process = this.spawn(cmder, arg, option);
            
            // bind
            this.process.stderr.on('data', (data) => {
              res = this.parseMessage(data);
              if (!isSilent) {
                return this.info('error', data);
              }
            });
            this.process.stdout.on('data', (data) => {
              res = this.parseMessage(data);
              if (!isSilent) {
                return this.info(data);
              }
            });
            return this.process.on('close', function(code) {
              if (code === 0 || isIgnoreError) {
                return resolve([true, res]);
              }
              return resolve([false, res]);
            });
          }));
          return [
            status,
            result // return
          ];
        }

        info(...arg) {
          var string, type;
          [type, string] = (function() {
            switch (arg.length) {
              case 1:
                return [null, arg[0]];
              case 2:
                return arg;
              default:
                throw new Error('invalid argument length');
            }
          })();
          string = $.trim(string);
          if (!string.length) {
            return;
          }
          string = string.replace(/\r/g, '\n').replace(/\n{2,}/g, '');
          string = (function() {
            switch (type) {
              case 'error':
                return kleur.red(string);
              default:
                return kleur.gray(string);
            }
          })();
          return $.log(string);
        }

        parseMessage(buffer) {
          return _.trimEnd($.parseString(buffer), '\n');
        }

      };

      /*
      spawn
      */
      M.prototype.spawn = require('child_process').spawn;

      return M;

    }).call(this);
    
    // return
    return $.exec_ = async function(cmd, option) {
      var m;
      if (!cmd) {
        return false;
      }
      m = new M();
      return (await m.execute_(cmd, option));
    };
  };

}).call(this);
