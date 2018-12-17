listKey = [
  'backup'
  'compile'
  'copy'
  'delay'
  'download'
  'isExisted'
  'isSame'
  'link'
  'lint'
  'mkdir'
  'move'
  'read'
  'recover'
  'remove'
  'rename'
  'replace'
  'say'
  'shell'
  'source'
  'stat'
  'unzip'
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
  'mkdir'
  'remove'
  'shell'
  'upload'
  'uploadDir'
  'uploadFile'
]
for key in listKey
  $.ssh["#{key}Async"] = $.ssh["#{key}_"]