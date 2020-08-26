import { $ } from '..'

// function

function a() {
  if ($.type($.home) !== 'function') throw new Error('0')
}

// export
export { a }