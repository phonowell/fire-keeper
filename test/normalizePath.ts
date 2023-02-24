import path from 'path'

import { $ } from './index'

// function

const a = () => {
  const question = './source'
  const answer = `${$.root()}/source`
  if ($.normalizePath(question) !== answer)
    throw new Error(`${$.normalizePath(question)} !== ${answer}`)
}

const b = () => {
  const question = '~/opt'
  const answer = `${$.home()}/opt`
  if ($.normalizePath(question) !== answer) throw new Error('0')
}

const c = () => {
  const question = './a/b/../c'
  const answer = `${$.root()}/a/c`
  if ($.normalizePath(question) !== answer) throw new Error('0')
}

const d = () => {
  const question = '../a'
  const answer = path.normalize(`${$.root()}/../a`).replace(/\\/g, '/')
  if ($.normalizePath(question) !== answer)
    throw new Error(`${$.normalizePath(question)} !== ${answer}`)
}

// export
export { a, b, c, d }
