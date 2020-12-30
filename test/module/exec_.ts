import { $ } from '..'

// function

async function a_(): Promise<void> {

  const [status, result] = await $.exec_('npm -v')

  if (!status) throw new Error('0')
  if (!~result.search(/\d+\.\d+\.\d+/u)) throw new Error('1')
}

async function b_(): Promise<void> {

  const [status] = await $.exec_('fire-keeper-error')
  if (status) throw new Error('0')
}

// export
export {
  a_,
  b_,
}
