import { describe, it } from 'mocha'

import { argv, echo, normalizePath, remove } from '../src/index.js'

import * as argvTests from './argv.js'
import * as atTests from './at.js'
import * as backupTests from './backup.js'
import * as cleanTests from './clean.js'
import * as copyTests from './copy.js'
import * as downloadTests from './download.js'
import * as echoTests from './echo.js'
import * as execTests from './exec.js'
import * as findIndexTests from './findIndex.js'
import * as flattenTests from './flatten.js'
import * as getBasenameTests from './getBasename.js'
import * as getDirnameTests from './getDirname.js'
import * as getExtnameTests from './getExtname.js'
import * as getFilenameTests from './getFilename.js'
import * as getNameTests from './getName.js'
import * as globTests from './glob.js'
import * as homeTests from './home.js'
import * as isExistTests from './isExist.js'
import * as isSameTests from './isSame.js'
import * as linkTests from './link.js'
import * as mkdirTests from './mkdir.js'
import * as moveTests from './move.js'
import * as normalizePathTests from './normalizePath.js'
import * as osTests from './os.js'
import * as promptTests from './prompt.js'
import * as readTests from './read.js'
import * as recoverTests from './recover.js'
import * as removeTests from './remove.js'
import * as renameTests from './rename.js'
import * as rootTests from './root.js'
import * as runTests from './run.js'
import * as runConcurrentTests from './runConcurrent.js'
import * as sleepTests from './sleep.js'
import * as statTests from './stat.js'
import * as toArrayTests from './toArray.js'
import * as toDateTests from './toDate.js'
import * as trimEndTests from './trimEnd.js'
import * as watchTests from './watch.js'
import * as wrapListTests from './wrapList.js'
import * as writeTests from './write.js'
import * as zipTests from './zip.js'

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
