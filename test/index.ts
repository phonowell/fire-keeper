import * as argv from './argv'
import * as backup from './backup'
import * as clean from './clean'
import * as copy from './copy'
import * as download from './download'
import * as exec from './exec'
import * as getBasename from './getBasename'
import * as getDirname from './getDirname'
import * as getExtname from './getExtname'
import * as getFilename from './getFilename'
import * as getName from './getName'
import * as glob from './glob'
import * as home from './home'
import * as isExisted from './isExisted'
import * as isSame from './isSame'
import * as link from './link'
import * as log from './log'
import * as mkdir from './mkdir'
import * as normalizePath from './normalizePath'
import * as os from './os'
import * as prompt from './prompt'
import * as read from './read'
import * as recover from './recover'
import * as remove from './remove'
import * as rename from './rename'
import * as root from './root'
import * as say from './say'
import * as sleep from './sleep'
import * as stat from './stat'
import * as toArray from './toArray'
import * as toJson from './toJson'
import * as toString from './toString'
import * as type from './type'
import * as watch from './watch'
import * as wrapList from './wrapList'
import * as write from './write'
import * as zip from './zip'
import { describe, it } from 'mocha'
import $ from '../source/index'
const mapModule = {
  argv, backup, clean, copy, download, exec, getBasename, getDirname, getExtname, getFilename, getName, glob, home, isExisted, isSame, link, log, mkdir, normalizePath, os, prompt, read, recover, remove, rename, root, say, sleep, stat, toArray, toJson, toString, type, watch, wrapList, write, zip,
}

// ---

// interface

type FnAsync = (...args: unknown[]) => Promise<unknown>

// variable

const temp = $.normalizePath('./temp')

// function

const clear = () => $.log.whisper($.remove(temp))

const main = () => {

  const target = $.argv<{ _: string[] }>()._[1] || ''

  const listModule = target
    ? [target]
    : Object.keys(mapModule)

  for (const name of listModule) describe(name, () => {
    const listIt = Object.keys(mapModule[name])
    for (const key of listIt) {
      const fn = mapModule[name][key] as FnAsync & { description?: string }
      it(fn.description || (listIt.length === 1 ? 'default' : key), async () => {
        await clear()
        await $.log.freeze(fn)
      })
    }
  })
}

// execute
main()

// export
export { $, clear, temp }