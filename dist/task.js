var $, M, gulp, m;

$ = {};

$.type = require('../dist/type');

gulp = require('gulp');

M = class M {
  /*
  add(name, fn)
  execute(name, fn)
  get([name])
  */
  add(name, fn) {
    var _fn, type;
    type = $.type(fn);
    if (type !== 'asyncfunction' && type !== 'function') {
      throw new Error(`task/error: invalid type of '${name}()': '${type}'`);
    }
    if (type !== 'asyncfunction') {
      // generate a wrapper
      _fn = fn;
      fn = async function() {
        await new Promise(function(resolve) {
          return resolve();
        });
        return _fn();
      };
    }
    gulp.task(name, fn);
    return this;
  }

  execute(name, fn) {
    if (!fn) {
      return this.get(name);
    }
    this.add(name, fn);
    
    // magic value: true
    // do not change
    return true;
  }

  get(name) {
    var map, result;
    map = gulp._registry._tasks;
    if (!name) {
      result = {};
      for (name in map) {
        result[name] = map[name].unwrap();
      }
      return result;
    }
    result = map[name];
    if (!result) {
      throw new Error(`task/error: invalid task '${name}'`);
    }
    return result.unwrap();
  }

};

m = new M();

module.exports = function(...arg) {
  var result;
  result = m.execute(...arg);
  
  // magic value
  if (result !== true) {
    return result;
  }
  return this;
};
