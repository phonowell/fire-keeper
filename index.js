var $, i, j, key, len, len1, listLazyModule, listLazyTask, path;

path = require('path');

$ = {};

// inject module
listLazyModule = ['_watch', 'argv', 'backup_', 'build_', 'chain', 'clean_', 'compile_', 'copy_', 'download_', 'exec_', 'fetchGithub_', 'formatArgument', 'getBasename', 'getDirname', 'getExtname', 'getFilename', 'getName', 'home', 'i', 'info', 'isExisted_', 'isSame_', 'link_', 'lint_', 'mkdir_', 'move_', 'normalizePath', 'normalizePathToArray', 'os', 'parseJson', 'parseString', 'prompt_', 'read_', 'recover_', 'reload', 'remove_', 'rename_', 'require', 'root', 'say_', 'sleep_', 'source_', 'ssh', 'stat_', 'task', 'type', 'walk_', 'watch', 'wrapList', 'write_', 'zip_'];

for (i = 0, len = listLazyModule.length; i < len; i++) {
  key = listLazyModule[i];
  (function(key) {
    // function
    return $[key] = !key.endsWith('_') ? function(...arg) {
      $[key] = require(path.resolve(__dirname, `./dist/${key}.js`));
      return $[key](...arg);
    // async function
    } : async function(...arg) {
      $[key] = require(path.resolve(__dirname, `./dist/${key}.js`));
      return (await $[key](...arg));
    };
  })(key);
}

// inject task
listLazyTask = ['build', 'default', 'gurumin', 'kokoro', 'lint', 'noop', 'prune', 'update', 'watch'];

for (j = 0, len1 = listLazyTask.length; j < len1; j++) {
  key = listLazyTask[j];
  (function(key) {
    return $.task(key, async function(...arg) {
      var fn_;
      fn_ = require(path.resolve(__dirname, `./dist/task/${key}`));
      return (await fn_(...arg));
    });
  })(key);
}

// return
module.exports = $;
