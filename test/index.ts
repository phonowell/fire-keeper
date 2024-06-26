import * as argv from './argv'
import * as backup from './backup'
import * as clean from './clean'
import * as copy from './copy'
import * as echo from './echo'
import * as exec from './exec'
import * as getBasename from './getBasename'
import * as getDirname from './getDirname'
import * as getExtname from './getExtname'
import * as getFilename from './getFilename'
import * as getName from './getName'
import * as getType from './getType'
import * as glob from './glob'
import * as home from './home'
import * as isExist from './isExist'
import * as isSame from './isSame'
import * as link from './link'
import * as mkdir from './mkdir'
import * as move from './move'
import * as normalizePath from './normalizePath'
import * as os from './os'
import * as prompt from './prompt'
import * as read from './read'
import * as recover from './recover'
import * as remove from './remove'
import * as rename from './rename'
import * as root from './root'
import * as sleep from './sleep'
import * as stat from './stat'
import * as toArray from './toArray'
import * as toDate from './toDate'
import * as toJSON from './toJSON'
import * as toString from './toString'
import * as watch from './watch'
import * as wrapList from './wrapList'
import * as write from './write'
import * as zip from './zip'
import { describe, it } from 'mocha'
import * as $ from '../src/index'
const mapModule = {
  argv, backup, clean, copy, echo, exec, getBasename, getDirname, getExtname, getFilename, getName, getType, glob, home, isExist, isSame, link, mkdir, move, normalizePath, os, prompt, read, recover, remove, rename, root, sleep, stat, toArray, toDate, toJSON, toString, watch, wrapList, write, zip,
}

// ---

// interface

type FnAsync = (...args: unknown[]) => Promise<unknown>

// variable

const temp = $.normalizePath('./temp')

// functions

const clear = () => $.echo.whisper($.remove(temp))

const main = () => {
  const target = ($.argv<{ _: string[] }>()._[1] || '') as
    | keyof typeof mapModule
    | undefined

  const listModule = target
    ? [target]
    : (Object.keys(mapModule) as (keyof typeof mapModule)[])

  for (const name of listModule)
    describe(name, () => {
      const listIt = Object.keys(mapModule[name])
      for (const key of listIt) {
        const fn = mapModule[name][key] as FnAsync & { description?: string }
        it(
          fn.description ?? (listIt.length === 1 ? 'default' : key),
          async () => {
            await clear()
            await $.echo.freeze(fn)
          },
        )
      }
    })
}

// execute
main()

// export
export { $, clear, temp }
