import { $ } from '..'

// function

async function a_() {
  if (typeof $.watch !== 'function') throw new Error('0')
}

// export
export {
  a_
}