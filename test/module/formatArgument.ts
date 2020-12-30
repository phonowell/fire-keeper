import { $ } from '..'
import isEqual from 'lodash/isEqual'

// function

function a(): void {

  const question = 'test/a'
  const answer = ['test/a']
  if (!isEqual($.formatArgument(question), answer)) throw new Error('0')
}
a.description = 'string -> string[]'

function b(): void {

  const question = ['test/b']
  const answer = ['test/b']
  if (!isEqual($.formatArgument(question), answer)) throw new Error('0')
}
b.description = 'string[] -> string[]'

// export
export {
  a,
  b,
}
