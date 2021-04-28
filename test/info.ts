import { $ } from './index'

// function

const a = (): void => {

  if ($.info() !== $.info()) throw new Error('0')

  let type = ''

  type = $.type($.info().renderPath)
  if (type !== 'function') throw new Error('1')

  type = $.type($.info().whisper_)
  if (type !== 'function') throw new Error(`2: ${type}`)

  if ($.info('test') !== 'test') throw new Error('3')
}

// export
export { a }