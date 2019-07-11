var $, M, kleur;

$ = {};

$.clean_ = require('../dist/clean_');

$.read_ = require('../dist/read_');

$.chain = require('../dist/chain');

$.info = require('../dist/info');

$.exec_ = require('../dist/exec_');

$.write_ = require('../dist/write_');

kleur = require('kleur');

M = (function() {
  class M {
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
      [status, version] = (await $.exec_(`npm view ${name} version`, {
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
        versionLatest = (await $.info.silence_(async() => {
          return (await this.getLatestVersion_(name));
        }));
        if (versionCurrent === versionLatest) {
          $.info('update', `'${name}': '${versionCurrent}' == '${versionLatest}'`);
          continue;
        }
        $.info('update', `'${name}': '${versionCurrent}' ${kleur.green('->')} '${versionLatest}'`);
        lineCmd = ['npm install', `${name}@${versionLatest}`, isDev ? '' : '--production', isDev ? '--save-dev' : '--save'].join(' ');
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
  M.prototype.cache = null;

  M.prototype.listCmd = [];

  M.prototype.namespace = '$.update_';

  M.prototype.pathCache = './temp/cache-update.json';

  return M;

}).call(this);

module.exports = async function(...arg) {
  var m;
  m = new M();
  await m.execute_(...arg);
  return this;
};
