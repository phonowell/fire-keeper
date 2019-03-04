# important, never change
listKey = ['backup_', 'clean_', 'compile_', 'copy_', 'delay_', 'download_', 'exec_', 'isExisted_', 'isSame_', 'link_', 'lint_', 'mkdir_', 'move_', 'prompt_', 'read_', 'recover_', 'remove_', 'rename_', 'say_', 'source_', 'stat_', 'update_', 'walk_', 'write_', 'zip_']

for key in listKey
  do (key) ->
    $[key] = (arg...) ->
      fn = require "./build/#{key}.js"
      fn_ = $[key] = fn $
      await fn_ arg...