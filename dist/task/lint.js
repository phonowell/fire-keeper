var $;

$ = {};

$.lint_ = require('../../dist/lint_');

module.exports = async function() {
  return (await $.lint_([
    './**/*.coffee',
    './**/*.md',
    // './**/*.pug'
    './**/*.styl',
    // './**/*.ts'
    '!**/node_modules/**',
    '!**/gurumin/**',
    '!**/nib/**'
  ]));
};
