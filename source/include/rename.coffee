listKey = [
  'backup'
  'compile'
  'copy'
  'delay'
  'download'
  'exec'
  'isExisted'
  'isSame'
  'link'
  'lint'
  'mkdir'
  'move'
  'prompt'
  'read'
  'recover'
  'remove'
  'rename'
  'say'
  'source'
  'stat'
  'update'
  'walk'
  'write'
  'zip'
]
for key in listKey
  $["#{key}Async"] = $["#{key}_"]

# ssh
listKey = [
  'connect'
  'disconnect'
  'exec'
  'mkdir'
  'remove'
  'upload'
  'uploadDir'
  'uploadFile'
]
for key in listKey
  $.ssh["#{key}Async"] = $.ssh["#{key}_"]