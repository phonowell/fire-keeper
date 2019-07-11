var watch;

watch = require('gulp-watch');

module.exports = function(...arg) {
  watch(...arg);
  return this;
};
