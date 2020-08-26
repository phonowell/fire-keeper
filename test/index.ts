import * as __module_argv__ from './module/argv'
import * as __module_backup___ from './module/backup_'
import * as __module_clean___ from './module/clean_'
import * as __module_compile___ from './module/compile_'
import * as __module_copy___ from './module/copy_'
import * as __module_download___ from './module/download_'
import * as __module_exec___ from './module/exec_'
import * as __module_formatArgument__ from './module/formatArgument'
import * as __module_getBasename__ from './module/getBasename'
import * as __module_getDirname__ from './module/getDirname'
import * as __module_getExtname__ from './module/getExtname'
import * as __module_getFilename__ from './module/getFilename'
import * as __module_getName__ from './module/getName'
import * as __module_home__ from './module/home'
import * as __module_i__ from './module/i'
import * as __module_info__ from './module/info'
import * as __module_isExisted___ from './module/isExisted_'
import * as __module_isSame___ from './module/isSame_'
import * as __module_link___ from './module/link_'
import * as __module_mkdir___ from './module/mkdir_'
import * as __module_move___ from './module/move_'
import * as __module_normalizePath__ from './module/normalizePath'
import * as __module_normalizePathToArray__ from './module/normalizePathToArray'
import * as __module_os__ from './module/os'
import * as __module_parseJson__ from './module/parseJson'
import * as __module_parseString__ from './module/parseString'
import * as __module_prompt___ from './module/prompt_'
import * as __module_read___ from './module/read_'
import * as __module_recover___ from './module/recover_'
import * as __module_remove___ from './module/remove_'
import * as __module_rename___ from './module/rename_'
import * as __module_require__ from './module/require'
import * as __module_root__ from './module/root'
import * as __module_say___ from './module/say_'
import * as __module_sleep___ from './module/sleep_'
import * as __module_source___ from './module/source_'
import * as __module_stat___ from './module/stat_'
import * as __module_task__ from './module/task'
import * as __module_type__ from './module/type'
import * as __module_watch__ from './module/watch'
import * as __module_wrapList__ from './module/wrapList'
import * as __module_write___ from './module/write_'
import * as __module_zip___ from './module/zip_'
const mapModule = {
  argv: __module_argv__,
  backup_: __module_backup___,
  clean_: __module_clean___,
  compile_: __module_compile___,
  copy_: __module_copy___,
  download_: __module_download___,
  exec_: __module_exec___,
  formatArgument: __module_formatArgument__,
  getBasename: __module_getBasename__,
  getDirname: __module_getDirname__,
  getExtname: __module_getExtname__,
  getFilename: __module_getFilename__,
  getName: __module_getName__,
  home: __module_home__,
  i: __module_i__,
  info: __module_info__,
  isExisted_: __module_isExisted___,
  isSame_: __module_isSame___,
  link_: __module_link___,
  mkdir_: __module_mkdir___,
  move_: __module_move___,
  normalizePath: __module_normalizePath__,
  normalizePathToArray: __module_normalizePathToArray__,
  os: __module_os__,
  parseJson: __module_parseJson__,
  parseString: __module_parseString__,
  prompt_: __module_prompt___,
  read_: __module_read___,
  recover_: __module_recover___,
  remove_: __module_remove___,
  rename_: __module_rename___,
  require: __module_require__,
  root: __module_root__,
  say_: __module_say___,
  sleep_: __module_sleep___,
  source_: __module_source___,
  stat_: __module_stat___,
  task: __module_task__,
  type: __module_type__,
  watch: __module_watch__,
  wrapList: __module_wrapList__,
  write_: __module_write___,
  zip_: __module_zip___
}

// ---

import $ from '../source'
import { describe, it } from 'mocha'
import { IFnAsync } from '../source/type'

// variable

const temp = $.normalizePath('./temp')

// function

async function clean_(): Promise<void> {
  await $.info().whisper_(async () => await $.remove_(temp))
}

// execute

const { target } = $.argv()
const listModule = target
  ? [target as string]
  : Object.keys(mapModule)

for (const name of listModule)
  describe(name, () => {
    const listIt = Object.keys(mapModule[name])
    for (const key of listIt) {
      const fn_ = mapModule[name][key] as IFnAsync & { description?: string }
      it(fn_.description || (listIt.length === 1 ? 'default' : key), async () => {
        await clean_()
        await $.info().freeze_(fn_)
      })
    }
  })

// export
export { $, clean_, temp }