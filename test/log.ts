import { renderPath } from '../source/log'
import { $ } from './index'

// function

const a = () => {
  let type = ''

  type = $.getType(renderPath)
  if (type !== 'function') throw new Error('1')

  type = $.getType($.log.whisper)
  if (type !== 'function') throw new Error(`2: ${type}`)

  if ($.log('test') !== 'test') throw new Error('3')
}

// export
export { a }
