import { renderPath } from '../source/info'
import { $ } from './index'

// function

const a = () => {

  let type = ''

  type = $.type(renderPath)
  if (type !== 'function') throw new Error('1')

  type = $.type($.info.whisper)
  if (type !== 'function') throw new Error(`2: ${type}`)

  if ($.info('test') !== 'test') throw new Error('3')
}

// export
export { a }