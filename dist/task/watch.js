var $;

$ = {};

$._watch = require('../../dist/_watch');

module.exports = function() {
  $._watch();
  return this;
};
