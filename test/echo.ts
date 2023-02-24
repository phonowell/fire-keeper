import { renderPath } from '../source/echo'

import { $ } from './index'

// function

const a = () => {
  let type = ''

  type = $.getType(renderPath)
  if (type !== 'function') throw new Error('1')

  type = $.getType($.echo.whisper)
  if (type !== 'function') throw new Error(`2: ${type}`)

  if ($.echo('test') !== 'test') throw new Error('3')
}

// export
export { a }
