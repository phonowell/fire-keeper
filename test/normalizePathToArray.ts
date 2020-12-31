import { $ } from './index'
import isEqual from 'lodash/isEqual'

// function

function a(): void {

  const question = [
    './source',
    '~/opt',
    'opt/a/b/../c',
    '!**/include/**',
  ]
  const answer = [
    `${$.root()}/source`,
    `${$.home()}/opt`,
    `${$.root()}/opt/a/c`,
    `!${$.root()}/**/include/**`,
  ]
  if (!isEqual($.normalizePathToArray(question), answer)) throw new Error('0')
}

// export
export { a }
