module.exports = ->

  await $.lint_ [
    # './**/*.pug'
    # './**/*.ts'
    './**/*.coffee'
    './**/*.md'
    './**/*.styl'
    # ---
    '!**/nib/**'
    '!**/node_modules/**'
  ]