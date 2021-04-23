import { $ } from './index'

// function

const a_ = async (): Promise<void> => {

  const [status, result] = await $.exec_('npm -v')

  if (!status) throw new Error('0')
  if (!~result.search(/\d+\.\d+\.\d+/u)) throw new Error('1')
}

const b_ = async (): Promise<void> => {

  const [status] = await $.exec_('fire-keeper-error')
  if (status) throw new Error('0')
}

// export
export {
  a_,
  b_,
}
