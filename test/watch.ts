import { $ } from './index'

// function

async function a_(): Promise<void> {

  if (typeof $.watch !== 'function') throw new Error('0')
}

// export
export {
  a_,
}
