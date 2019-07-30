var $;

$ = {};

$.exec_ = require('../../dist/exec_');

$.remove_ = require('../../dist/remove_');

// https://github.com/tj/node-prune
module.exports = async function() {
  var base, line, listDirectory, listExtension, listFile, listSource;
  // await $.exec_ 'npm prune'
  base = './node_modules';
  // file
  listFile = ['.DS_Store', '.appveyor.yml', '.babelrc', '.coveralls.yml', '.documentup.json', '.editorconfig', '.eslintignore', '.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml', '.flowconfig', '.gitattributes', '.gitlab-ci.yml', '.htmllintrc', '.jshintrc', '.lint', '.npmignore', '.stylelintrc', '.stylelintrc.js', '.stylelintrc.json', '.stylelintrc.yaml', '.stylelintrc.yml', '.tern-project', '.travis.yml', '.yarn-integrity', '.yarn-metadata.json', '.yarnclean', '.yo-rc.json', 'AUTHORS', 'CHANGES', 'CONTRIBUTORS', 'Gruntfile.js', 'Gulpfile.js', 'LICENCE', 'LICENCE-MIT', 'LICENCE.BSD', 'LICENCE.txt', 'LICENSE', 'LICENSE-MIT', 'LICENSE.BSD', 'LICENSE.txt', 'Makefile', '_config.yml', 'appveyor.yml', 'changelog', 'circle.yml', 'eslint', 'gulpfile.js', 'htmllint.js', 'jest.config.js', 'karma.conf.js', 'licence', 'license', 'stylelint.config.js', 'tsconfig.json'];
  listSource = (function() {
    var i, len, results;
    results = [];
    for (i = 0, len = listFile.length; i < len; i++) {
      line = listFile[i];
      results.push(`${base}/**/${line}`);
    }
    return results;
  })();
  await $.remove_(listSource);
  // directory
  listDirectory = ['.circleci', '.github', '.idea', '.nyc_output', '.vscode', '__tests__', 'assets', 'coverage', 'doc', 'docs', 'example', 'examples', 'images', 'powered-test', 'test', 'tests', 'website'];
  listSource = (function() {
    var i, len, results;
    results = [];
    for (i = 0, len = listDirectory.length; i < len; i++) {
      line = listDirectory[i];
      results.push(`${base}/**/${line}`);
    }
    return results;
  })();
  await $.remove_(listSource);
  // extension
  listExtension = ['.coffee', '.jst', '.markdown', '.md', '.mkd', '.swp', '.tgz', '.ts'];
  listSource = (function() {
    var i, len, results;
    results = [];
    for (i = 0, len = listExtension.length; i < len; i++) {
      line = listExtension[i];
      results.push(`${base}/**/*${line}`);
    }
    return results;
  })();
  await $.remove_(listSource);
  return this;
};
