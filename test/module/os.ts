import { $ } from '..'

// function

function a() {
  if ($.type($.os) !== 'function') throw new Error('0')
}

// export
export { a }