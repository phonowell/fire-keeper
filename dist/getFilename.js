var $;

$ = {};

$.getName = require('../dist/getName');

module.exports = function(source) {
  return ($.getName(source)).filename;
};
