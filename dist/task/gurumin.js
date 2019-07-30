var $;

$ = {};

$.fetchGitHub_ = require('../../dist/fetchGitHub_');

$.remove_ = require('../../dist/remove_');

$.copy_ = require('../../dist/copy_');

module.exports = async function() {
  await $.fetchGitHub_('phonowell/gurumin');
  await $.remove_('./gurumin');
  await $.copy_('./../gurumin/source/**/*', './gurumin');
  return this;
};
