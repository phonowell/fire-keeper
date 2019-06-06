(function() {
  module.exports = function($) {
    var M, _;
    ({_} = $);
    // path = require 'path'
    M = class M {
      constructor(option) {
        /*
        data
          compile
            extend
            extname
          copy
            extend
            extname
          option
          path
            source
            target
        */
        var data;
        data = {
          compile: {
            extend: ['!**/include/**', '!**/*.min.*'],
            extname: [
              '.coffee',
              '.css',
              '.html',
              '.js',
              '.md',
              '.pug',
              '.styl',
              // '.ts'
              '.yaml'
            ]
          },
          copy: {
            extend: ['!**/include/**'],
            extname: ['.css', '.gif', '.html', '.jpg', '.js', '.json', '.png', '.ttf', '.txt', '.vue', '.xml']
          },
          option: {},
          path: {
            source: './source',
            target: './dist'
          }
        };
        this.data = _.merge(data, option);
        this; // return
      }

      /*
      bind()
      compile_()
      copy_()
      execute()
      get(key)
      reloadCss()
      watchCompile()
      watchCopy()
      */
      bind() {
        process.on('uncaughtException', function(e) {
          return $.i(e.stack);
        });
        return this;
      }

      async compile_(source, option = {}) {
        var reg, stringSource, stringTarget, target;
        stringSource = $.getBasename(this.get('path.source'));
        stringTarget = $.getBasename(this.get('path.target'));
        reg = new RegExp(stringSource);
        target = $.getDirname(source).replace(reg, stringTarget).replace(/\/{2,}/g, '/');
        if (option.map == null) {
          option.map = true;
        }
        if (option.minify == null) {
          option.minify = false;
        }
        await $.compile_(source, target, option);
        return this;
      }

      async copy_(source) {
        var reg, stringSource, stringTarget, target;
        stringSource = $.getBasename(this.get('path.source'));
        stringTarget = $.getBasename(this.get('path.target'));
        reg = new RegExp(stringSource);
        target = $.getDirname(source).replace(reg, stringTarget).replace(/\/{2,}/g, '/');
        await $.copy_(source, target);
        return this;
      }

      execute() {
        this.bind().watchCompile().watchCopy().reloadCss();
        return this;
      }

      get(key) {
        return _.get(this.data, key);
      }

      reloadCss() {
        var pathTarget;
        pathTarget = this.get('path.target');
        $.reload(`${pathTarget}/**/*.css`);
        return this;
      }

      watchCompile() {
        var ext, listExt, listSource, pathBuild, pathSource;
        listExt = this.get('compile.extname');
        pathSource = this.get('path.source');
        pathBuild = this.get('path.build');
        listSource = [
          ...((function() {
            var i,
          len,
          results;
            results = [];
            for (i = 0, len = listExt.length; i < len; i++) {
              ext = listExt[i];
              results.push(`${pathSource}/**/*${ext}`);
            }
            return results;
          })()),
          ...(this.get('compile.extend'))
        ];
        $.watch(listSource, async(e) => {
          return (await this.compile_(e.path, this.data.option));
        });
        return this;
      }

      watchCopy() {
        var ext, listExt, listSource, pathBuild, pathSource;
        listExt = this.get('copy.extname');
        pathSource = this.get('path.source');
        pathBuild = this.get('path.build');
        listSource = [
          ...((function() {
            var i,
          len,
          results;
            results = [];
            for (i = 0, len = listExt.length; i < len; i++) {
              ext = listExt[i];
              results.push(`${pathSource}/**/*${ext}`);
            }
            return results;
          })()),
          ...(this.get('copy.extend'))
        ];
        $.watch(listSource, async(e) => {
          return (await this.copy_(e.path));
        });
        return this;
      }

    };
    
    // return
    return $._watch = function(option = {}) {
      var m;
      m = new M(option);
      m.execute();
      return $; // return
    };
  };

}).call(this);
