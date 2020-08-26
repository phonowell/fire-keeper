import { $ } from '..'

// function

async function a_(): Promise<void> {
  if (typeof $.require !== 'function') throw new Error('0')
}

// export
export {
  a_
}