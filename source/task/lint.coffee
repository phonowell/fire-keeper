export default ->

  await $.lint_ [
    './**/*.coffee'
    './**/*.md'
    # './**/*.pug'
    './**/*.styl'
    # './**/*.ts'
    '!**/node_modules/**'
    '!**/gurumin/**'
    '!**/nib/**'
  ]