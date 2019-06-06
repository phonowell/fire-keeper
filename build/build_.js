(function() {
  module.exports = function($) {
    var M, _;
    ({_} = $);
    // path = require 'path'
    M = class M {
      constructor(option) {
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
            target: './build'
          }
        };
        this.data = _.merge(data, option);
        this; // return
      }

      /*
      clean_()
      compile_()
      copy_()
      execute_()
      get(key)
      */
      async clean_() {
        await $.remove_(this.get('path.target'));
        return this;
      }

      async compile_() {
        var ext, listExt, listSource, option, pathSource, pathTarget;
        listExt = this.get('compile.extname');
        pathSource = this.get('path.source');
        pathTarget = this.get('path.target');
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
        option = _.clone(this.data.option);
        option.base = pathSource;
        await $.compile_(listSource, pathTarget, option);
        return this;
      }

      async copy_() {
        var ext, listExt, listSource, pathSource, pathTarget;
        listExt = this.get('copy.extname');
        pathSource = this.get('path.source');
        pathTarget = this.get('path.target');
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
        await $.copy_(listSource, pathTarget);
        return this;
      }

      async execute_() {
        await $.chain(this).clean_().copy_().compile_();
        return this;
      }

      get(key) {
        return _.get(this.data, key);
      }

    };
    
    // return
    return $.target_ = async function(option = {}) {
      var m;
      m = new M(option);
      await m.execute_();
      return $; // return
    };
  };

}).call(this);
