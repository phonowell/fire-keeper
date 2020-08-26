import { $ } from '..'
import path from 'path'

// function

function a() {
  const question = './source'
  const answer = `${$.root()}/source`
  if ($.normalizePath(question) !== answer) throw new Error('0')
}

function b() {
  const question = '~/opt'
  const answer = `${$.home()}/opt`
  if ($.normalizePath(question) !== answer) throw new Error('0')
}

function c() {
  const question = './a/b/../c'
  const answer = `${$.root()}/a/c`
  if ($.normalizePath(question) !== answer) throw new Error('0')
}

function d() {
  const question = '../a'
  const answer = path.normalize(`${$.root()}/../a`)
  if ($.normalizePath(question) !== answer) throw new Error('0')
}

// export
export {
  a,
  b,
  c,
  d
}