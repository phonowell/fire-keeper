var $;

$ = {};

$.fetchGitHub_ = require('../../dist/fetchGitHub_');

$.info = require('../../dist/info');

$.remove_ = require('../../dist/remove_');

$.isSame_ = require('../../dist/isSame_');

$.copy_ = require('../../dist/copy_');

$.exec_ = require('../../dist/exec_');

$.root = require('../../dist/root');

module.exports = async function() {
  var LIST, filename, i, isSame, len, listClean, source, target;
  await $.fetchGitHub_('phonowell/kokoro');
  // clean
  listClean = ['./coffeelint.yaml', './coffeelint.yml', './stylint.yaml', './stylintrc.yml'];
  await $.info().silence_(async function() {
    return (await $.remove_(listClean));
  });
  // copy
  LIST = ['.gitignore', '.npmignore', '.stylintrc', 'coffeelint.json', 'license.md', 'tslint.json'];
  for (i = 0, len = LIST.length; i < len; i++) {
    filename = LIST[i];
    source = `./../kokoro/${filename}`;
    target = `./${filename}`;
    isSame = (await $.isSame_([source, target]));
    if (isSame === true) {
      continue;
    }
    await $.copy_(source, './');
    await $.exec_(`git add -f ${$.root()}/${filename}`);
  }
  return this;
};
