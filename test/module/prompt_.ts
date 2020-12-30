import { $ } from '..'

// function

function a(): void {
  if ($.type($.prompt_) !== 'asyncfunction') throw new Error('0')
}

// export
export { a }
