(function() {
  module.exports = function($) {
    return $.delay_ = async function(time = 0) {
      await new Promise(function(resolve) {
        return setTimeout(function() {
          return resolve();
        }, time);
      });
      $.info('delay', `delayed '${time} ms'`);
      return $; // return
    };
  };

}).call(this);
