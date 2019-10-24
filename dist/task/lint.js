var $;

$ = {};

$.lint_ = require('../../dist/lint_');

module.exports = async function() {
  return (await $.lint_([
    // './**/*.pug'
    // './**/*.ts'
    './**/*.coffee',
    './**/*.md',
    './**/*.styl',
    // ---
    '!**/nib/**',
    '!**/node_modules/**'
  ]));
};
