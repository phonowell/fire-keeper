import { $ } from '..'

// function

function a(): void {
  // eslint-disable-next-line no-self-compare
  if ($.info() !== $.info()) throw new Error('0')
  if ($.type($.info().renderPath) !== 'function') throw new Error('1')
  if ($.type($.info().whisper_) !== 'asyncfunction') throw new Error('2')
  if ($.info('test') !== 'test') throw new Error('3')
}

// export
export { a }
