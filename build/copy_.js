(function() {
  module.exports = function($) {
    var gulp, gulpIf, normalizePath, normalizePathToArray, using, wrapList;
    ({normalizePath, normalizePathToArray, wrapList} = $.fn);
    gulp = require('gulp');
    gulpIf = require('gulp-if');
    using = require('gulp-using');
    
    // return
    return $.copy_ = async function(...arg) {
      var msg, option, source, target;
      
      // source, target, [option]
      [source, target, option] = (function() {
        switch (arg.length) {
          case 2:
            return [arg[0], arg[1], null];
          case 3:
            return arg;
          default:
            throw new Error('invalid argument length');
        }
      })();
      source = normalizePathToArray(source);
      target = normalizePath(target);
      if (!source.length) {
        return $;
      }
      await new Promise(function(resolve) {
        var rename;
        
        // require
        rename = require('gulp-rename');
        return gulp.src(source, {
          allowEmpty: true
        }).pipe(using()).pipe(gulpIf(!!option, rename(option))).pipe(gulp.dest(function(e) {
          return target || e.base;
        })).on('end', function() {
          return resolve();
        });
      });
      msg = `copied ${wrapList(source)} to ${wrapList(target)}`;
      if (option) {
        msg += `, as '${$.parseString(option)}'`;
      }
      $.info('copy', msg);
      return $; // return
    };
  };

}).call(this);
