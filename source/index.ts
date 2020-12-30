import __module_argv__ from './module/argv'
import __module_backup___ from './module/backup_'
import __module_clean___ from './module/clean_'
import __module_compile___ from './module/compile_'
import __module_copy___ from './module/copy_'
import __module_download___ from './module/download_'
import __module_exec___ from './module/exec_'
import __module_formatArgument__ from './module/formatArgument'
import __module_getBasename__ from './module/getBasename'
import __module_getDirname__ from './module/getDirname'
import __module_getExtname__ from './module/getExtname'
import __module_getFilename__ from './module/getFilename'
import __module_getName__ from './module/getName'
import __module_home__ from './module/home'
import __module_i__ from './module/i'
import __module_info__ from './module/info'
import __module_isExisted___ from './module/isExisted_'
import __module_isSame___ from './module/isSame_'
import __module_link___ from './module/link_'
import __module_mkdir___ from './module/mkdir_'
import __module_move___ from './module/move_'
import __module_normalizePath__ from './module/normalizePath'
import __module_normalizePathToArray__ from './module/normalizePathToArray'
import __module_os__ from './module/os'
import __module_parseJson__ from './module/parseJson'
import __module_parseString__ from './module/parseString'
import __module_prompt___ from './module/prompt_'
import __module_read___ from './module/read_'
import __module_recover___ from './module/recover_'
import __module_remove___ from './module/remove_'
import __module_rename___ from './module/rename_'
import __module_require__ from './module/require'
import __module_root__ from './module/root'
import __module_say___ from './module/say_'
import __module_sleep___ from './module/sleep_'
import __module_source___ from './module/source_'
import __module_stat___ from './module/stat_'
import __module_task__ from './module/task'
import __module_type__ from './module/type'
import __module_watch__ from './module/watch'
import __module_wrapList__ from './module/wrapList'
import __module_write___ from './module/write_'
import __module_zip___ from './module/zip_'
const $ = {} as {
  argv: typeof __module_argv__
  backup_: typeof __module_backup___
  clean_: typeof __module_clean___
  compile_: typeof __module_compile___
  copy_: typeof __module_copy___
  download_: typeof __module_download___
  exec_: typeof __module_exec___
  formatArgument: typeof __module_formatArgument__
  getBasename: typeof __module_getBasename__
  getDirname: typeof __module_getDirname__
  getExtname: typeof __module_getExtname__
  getFilename: typeof __module_getFilename__
  getName: typeof __module_getName__
  home: typeof __module_home__
  i: typeof __module_i__
  info: typeof __module_info__
  isExisted_: typeof __module_isExisted___
  isSame_: typeof __module_isSame___
  link_: typeof __module_link___
  mkdir_: typeof __module_mkdir___
  move_: typeof __module_move___
  normalizePath: typeof __module_normalizePath__
  normalizePathToArray: typeof __module_normalizePathToArray__
  os: typeof __module_os__
  parseJson: typeof __module_parseJson__
  parseString: typeof __module_parseString__
  prompt_: typeof __module_prompt___
  read_: typeof __module_read___
  recover_: typeof __module_recover___
  remove_: typeof __module_remove___
  rename_: typeof __module_rename___
  require: typeof __module_require__
  root: typeof __module_root__
  say_: typeof __module_say___
  sleep_: typeof __module_sleep___
  source_: typeof __module_source___
  stat_: typeof __module_stat___
  task: typeof __module_task__
  type: typeof __module_type__
  watch: typeof __module_watch__
  wrapList: typeof __module_wrapList__
  write_: typeof __module_write___
  zip_: typeof __module_zip___
}
const listModule = [
  'argv',
  'backup_',
  'clean_',
  'compile_',
  'copy_',
  'download_',
  'exec_',
  'formatArgument',
  'getBasename',
  'getDirname',
  'getExtname',
  'getFilename',
  'getName',
  'home',
  'i',
  'info',
  'isExisted_',
  'isSame_',
  'link_',
  'mkdir_',
  'move_',
  'normalizePath',
  'normalizePathToArray',
  'os',
  'parseJson',
  'parseString',
  'prompt_',
  'read_',
  'recover_',
  'remove_',
  'rename_',
  'require',
  'root',
  'say_',
  'sleep_',
  'source_',
  'stat_',
  'task',
  'type',
  'watch',
  'wrapList',
  'write_',
  'zip_'
]
const listTask = [
  'default'
]

// ---

// interface

type FnAsync = (...args: unknown[]) => Promise<unknown>

// inject module
for (const name of listModule) {
  const isAsync = name.endsWith('_')
  if (!isAsync) {
    $[name] = function (
      ...args: unknown[]
    ) {

      $[name] = require(
        `./module/${name}`
      ).default as Function
      return $[name](...args)
    }
  } else {
    $[name] = async function (
      ...args: unknown[]
    ) {

      $[name] = require(
        `./module/${name}`
      ).default as FnAsync
      return $[name](...args)
    }
  }
}

// inject task
for (const name of listTask) {
  $.task(name, async (
    ...args: unknown[]
  ) => {

    const fn_ = require(
      `./task/${name}`
    ).default as FnAsync
    return fn_(...args)
  })
}

// export
export default $
