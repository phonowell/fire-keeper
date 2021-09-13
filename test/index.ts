import * as argv from './argv'
import * as backup from './backup'
import * as clean from './clean'
import * as compile from './compile'
import * as copy from './copy'
import * as download from './download'
import * as exec from './exec'
import * as formatArgument from './formatArgument'
import * as getBasename from './getBasename'
import * as getDirname from './getDirname'
import * as getExtname from './getExtname'
import * as getFilename from './getFilename'
import * as getName from './getName'
import * as home from './home'
import * as i from './i'
import * as info from './info'
import * as isExisted from './isExisted'
import * as isSame from './isSame'
import * as link from './link'
import * as mkdir from './mkdir'
import * as move from './move'
import * as normalizePath from './normalizePath'
import * as normalizePathToArray from './normalizePathToArray'
import * as os from './os'
import * as parseJson from './parseJson'
import * as parseString from './parseString'
import * as prompt from './prompt'
import * as read from './read'
import * as recover from './recover'
import * as remove from './remove'
import * as rename from './rename'
import * as root from './root'
import * as say from './say'
import * as sleep from './sleep'
import * as source from './source'
import * as stat from './stat'
import * as type from './type'
import * as watch from './watch'
import * as wrapList from './wrapList'
import * as write from './write'
import * as zip from './zip'
const mapModule = {
  argv,
  backup,
  clean,
  compile,
  copy,
  download,
  exec,
  formatArgument,
  getBasename,
  getDirname,
  getExtname,
  getFilename,
  getName,
  home,
  i,
  info,
  isExisted,
  isSame,
  link,
  mkdir,
  move,
  normalizePath,
  normalizePathToArray,
  os,
  parseJson,
  parseString,
  prompt,
  read,
  recover,
  remove,
  rename,
  root,
  say,
  sleep,
  source,
  stat,
  type,
  watch,
  wrapList,
  write,
  zip,
}

// ---

import { describe, it } from 'mocha'
import { freeze, whisper } from '../source/info'
import $ from '../source/index'

// interface

type FnAsync = (...args: unknown[]) => Promise<unknown>

// variable

const temp = $.normalizePath('./temp')

// function

const clear = () => whisper($.remove(temp))

// execute

const { target } = $.argv<{ target?: string }>()
const listModule = target
  ? [target]
  : Object.keys(mapModule)

for (const name of listModule)
  describe(name, () => {
    const listIt = Object.keys(mapModule[name])
    for (const key of listIt) {
      const fn = mapModule[name][key] as FnAsync & { description?: string }
      it(fn.description || (listIt.length === 1 ? 'default' : key), async () => {
        await clear()
        await freeze(fn)
      })
    }
  })

// export
export { $, clear, temp }