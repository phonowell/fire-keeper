import { $ } from '..'

// function

function a() {
  if ($.type($.root) !== 'function') throw new Error('0')
}

// export
export { a }