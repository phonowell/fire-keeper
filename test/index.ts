import * as mArgv from './argv'
import * as mBackup from './backup_'
import * as mClean from './clean_'
import * as mCompile from './compile_'
import * as mCopy from './copy_'
import * as mDownload from './download_'
import * as mExec from './exec_'
import * as mFormatArgument from './formatArgument'
import * as mGetBasename from './getBasename'
import * as mGetDirname from './getDirname'
import * as mGetExtname from './getExtname'
import * as mGetFilename from './getFilename'
import * as mGetName from './getName'
import * as mHome from './home'
import * as mI from './i'
import * as mInfo from './info'
import * as mIsExisted from './isExisted_'
import * as mIsSame from './isSame_'
import * as mLink from './link_'
import * as mMkdir from './mkdir_'
import * as mMove from './move_'
import * as mNormalizePath from './normalizePath'
import * as mNormalizePathToArray from './normalizePathToArray'
import * as mOs from './os'
import * as mParseJson from './parseJson'
import * as mParseString from './parseString'
import * as mPrompt from './prompt_'
import * as mRead from './read_'
import * as mRecover from './recover_'
import * as mRemove from './remove_'
import * as mRename from './rename_'
import * as mRequire from './require'
import * as mRoot from './root'
import * as mSay from './say_'
import * as mSleep from './sleep_'
import * as mSource from './source_'
import * as mStat from './stat_'
import * as mType from './type'
import * as mWatch from './watch'
import * as mWrapList from './wrapList'
import * as mWrite from './write_'
import * as mZip from './zip_'
const mapModule = {
  argv: mArgv,
  backup_: mBackup,
  clean_: mClean,
  compile_: mCompile,
  copy_: mCopy,
  download_: mDownload,
  exec_: mExec,
  formatArgument: mFormatArgument,
  getBasename: mGetBasename,
  getDirname: mGetDirname,
  getExtname: mGetExtname,
  getFilename: mGetFilename,
  getName: mGetName,
  home: mHome,
  i: mI,
  info: mInfo,
  isExisted_: mIsExisted,
  isSame_: mIsSame,
  link_: mLink,
  mkdir_: mMkdir,
  move_: mMove,
  normalizePath: mNormalizePath,
  normalizePathToArray: mNormalizePathToArray,
  os: mOs,
  parseJson: mParseJson,
  parseString: mParseString,
  prompt_: mPrompt,
  read_: mRead,
  recover_: mRecover,
  remove_: mRemove,
  rename_: mRename,
  require: mRequire,
  root: mRoot,
  say_: mSay,
  sleep_: mSleep,
  source_: mSource,
  stat_: mStat,
  type: mType,
  watch: mWatch,
  wrapList: mWrapList,
  write_: mWrite,
  zip_: mZip,
}

// ---

import { describe, it } from 'mocha'
import $ from '../source'

// interface

type FnAsync = (...args: unknown[]) => Promise<unknown>

// variable

const temp = $.normalizePath('./temp')

// function

async function clean_(): Promise<void> {
  await $.info().whisper_(async () => $.remove_(temp))
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
      const fn_ = mapModule[name][key] as FnAsync & { description?: string }
      it(fn_.description || (listIt.length === 1 ? 'default' : key), async () => {
        await clean_()
        await $.info().freeze_(fn_)
      })
    }
  })

// export
export { $, clean_, temp }
