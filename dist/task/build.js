var $;

$ = {};

$.build_ = require('../../dist/build_');

module.exports = async function() {
  await $.build_();
  return this;
};
