$ = require '../index'

module.exports = ->
  
  await $.zip_ '~/OneDrive/**/*.txt'
  , '~/OneDrive/..'
  , 'OneDriveX.zip'