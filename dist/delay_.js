var $;

$ = {};

$.info = require('../dist/info');

module.exports = async function(time = 0) {
  await new Promise(function(resolve) {
    return setTimeout(function() {
      return resolve();
    }, time);
  });
  if (time) {
    $.info('delay', `delayed '${time} ms'`);
  }
  return this;
};
