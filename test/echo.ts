import { renderPath } from '../src/echo'

import { $ } from './index'

const a = () => {
  let type = ''

  type = typeof renderPath
  if (type !== 'function') throw new Error('1')

  type = typeof $.echo.whisper
  if (type !== 'function') throw new Error(`2: ${type}`)
}

export { a }
