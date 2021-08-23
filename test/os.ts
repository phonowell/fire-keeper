import { $ } from './index'

// function

const a = () => {
  if ($.type($.os) !== 'function') throw new Error('0')
}

const b = () => {
  if (!$.os('macos')) return
  if (!$.os(['macos'])) throw new Error('1')
  if ($.os('windows')) throw new Error('2')
  if (!$.os(['macos', 'windows'])) throw new Error('3')
}

// export
export { a, b }
