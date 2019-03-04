(function() {
  module.exports = function($) {
    var Updater, kleur;
    kleur = require('kleur');
    Updater = (function() {
      class Updater {
        /*
        clean_()
        execute_(arg...)
        getLatestVersion_(name)
        listPkg_(list, isDev)
        */
        async clean_() {
          return (await $.clean_(this.pathCache));
        }

        async execute_(...arg) {
          var data;
          data = (await $.read_('./package.json'));
          await $.chain(this).listPkg_(data.dependencies, false).listPkg_(data.devDependencies, true);
          if (!this.listCmd.length) {
            $.info('update', 'everything is ok');
            await this.clean_();
            return this;
          }
          await $.exec_(this.listCmd);
          await this.clean_();
          return this;
        }

        async getLatestVersion_(name) {
          var status, version;
          this.cache || (this.cache = (await $.read_(this.pathCache)));
          this.cache || (this.cache = {});
          version = this.cache[name];
          if (version) {
            return version;
          }
          [status, version] = (await $.exec_(`cnpm view ${name} version`, {
            silent: true
          }));
          if (!status) {
            throw new Error(version);
          }
          this.cache[name] = version;
          await $.write_(this.pathCache, this.cache);
          return version; // return
        }

        async listPkg_(list, isDev) {
          var lineCmd, name, version, versionCurrent, versionLatest;
          for (name in list) {
            version = list[name];
            versionCurrent = version.replace(/[~^]/, '');
            $.info.pause(this.namespace);
            versionLatest = (await this.getLatestVersion_(name));
            $.info.resume(this.namespace);
            if (versionCurrent === versionLatest) {
              $.info('update', `'${name}': '${versionCurrent}' == '${versionLatest}'`);
              continue;
            }
            $.info('update', `'${name}': '${versionCurrent}' ${kleur.green('->')} '${versionLatest}'`);
            lineCmd = ['cnpm install', `${name}@${versionLatest}`, isDev ? '' : '--production', isDev ? '--save-dev' : '--save'].join(' ');
            lineCmd = lineCmd.replace(/\s{2,}/g, ' ');
            this.listCmd.push(lineCmd);
          }
          return this;
        }

      };

      /*
      cache
      listCmd
      namespace
      pathCache
      */
      Updater.prototype.cache = null;

      Updater.prototype.listCmd = [];

      Updater.prototype.namespace = '$.update_';

      Updater.prototype.pathCache = './temp/cache-update.json';

      return Updater;

    }).call(this);
    
    // return
    return $.update_ = async function(...arg) {
      var m;
      m = new Updater();
      await m.execute_(...arg);
      return $; // return
    };
  };

}).call(this);
