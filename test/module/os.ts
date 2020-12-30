import { $ } from '..'

// function

function a(): void {

  if ($.type($.os) !== 'function') throw new Error('0')
}

// export
export { a }
