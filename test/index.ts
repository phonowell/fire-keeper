import { describe, it } from 'mocha'

import { argv, echo, normalizePath, remove } from '../src'

import * as argvTests from './argv'
import * as atTests from './at'
import * as backupTests from './backup'
import * as cleanTests from './clean'
import * as copyTests from './copy'
import * as downloadTests from './download'
import * as echoTests from './echo'
import * as execTests from './exec'
import * as findIndexTests from './findIndex'
import * as flattenTests from './flatten'
import * as getBasenameTests from './getBasename'
import * as getDirnameTests from './getDirname'
import * as getExtnameTests from './getExtname'
import * as getFilenameTests from './getFilename'
import * as getNameTests from './getName'
import * as globTests from './glob'
import * as homeTests from './home'
import * as isExistTests from './isExist'
import * as isSameTests from './isSame'
import * as linkTests from './link'
import * as mkdirTests from './mkdir'
import * as moveTests from './move'
import * as normalizePathTests from './normalizePath'
import * as osTests from './os'
import * as promptTests from './prompt'
import * as readTests from './read'
import * as recoverTests from './recover'
import * as removeTests from './remove'
import * as renameTests from './rename'
import * as rootTests from './root'
import * as runTests from './run'
import * as runConcurrentTests from './runConcurrent'
import * as sleepTests from './sleep'
import * as statTests from './stat'
import * as toArrayTests from './toArray'
import * as toDateTests from './toDate'
import * as trimEndTests from './trimEnd'
import * as watchTests from './watch'
import * as wrapListTests from './wrapList'
import * as writeTests from './write'
import * as zipTests from './zip'

const mapModule = {
  argv: argvTests,
  at: atTests,
  backup: backupTests,
  clean: cleanTests,
  copy: copyTests,
  download: downloadTests,
  echo: echoTests,
  exec: execTests,
  findIndex: findIndexTests,
  flatten: flattenTests,
  getBasename: getBasenameTests,
  getDirname: getDirnameTests,
  getExtname: getExtnameTests,
  getFilename: getFilenameTests,
  getName: getNameTests,
  glob: globTests,
  home: homeTests,
  isExist: isExistTests,
  isSame: isSameTests,
  link: linkTests,
  mkdir: mkdirTests,
  move: moveTests,
  normalizePath: normalizePathTests,
  os: osTests,
  prompt: promptTests,
  read: readTests,
  recover: recoverTests,
  remove: removeTests,
  rename: renameTests,
  root: rootTests,
  run: runTests,
  runConcurrent: runConcurrentTests,
  sleep: sleepTests,
  stat: statTests,
  toArray: toArrayTests,
  toDate: toDateTests,
  trimEnd: trimEndTests,
  watch: watchTests,
  wrapList: wrapListTests,
  write: writeTests,
  zip: zipTests,
}

// ---

type Fn = () => Promise<void>

const TEMP = normalizePath('./temp')
console.log(`Using temporary directory: ${TEMP}`)

const cleanup = () => echo.whisper(remove(TEMP))

const main = async () => {
  const target = ((await argv())._[1] || '') as keyof typeof mapModule | ''

  const listModule = target
    ? [target]
    : (Object.keys(mapModule) as (keyof typeof mapModule)[])

  for (const name of listModule) {
    describe(name, () => {
      const listIt = Object.keys(mapModule[name])
      for (const key of listIt) {
        const fn = mapModule[name][key] as Fn & {
          description?: string
        }

        it(fn.description ?? key, async () => {
          await cleanup()
          await echo.freeze(fn)
        })
      }
    })
  }
}

main()

export { cleanup, TEMP }
