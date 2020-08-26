import { $ } from '..'

// function

function a() {
  if ($.type($.prompt_) !== 'asyncfunction') throw new Error('0')
}

// export
export { a }