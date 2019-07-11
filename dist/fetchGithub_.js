var $;

$ = {};

$.normalizePath = require('../dist/normalizePath');

$.isExisted_ = require('../dist/isExisted_');

$.exec_ = require('../dist/exec_');

module.exports = async function(name) {
  var source;
  source = $.normalizePath(`./../${(name.split('/')[1])}`);
  if ((await $.isExisted_(source))) {
    return (await $.exec_([`cd ${source}`, 'git fetch', 'git pull']));
  }
  return (await $.exec_(`git clone https://github.com/${name}.git ${source}`));
};
