import { $ } from './index'

// function

const a = async () => {

  const [status, result] = await $.exec('npm -v')

  if (!status) throw new Error('0')
  if (!~result.search(/\d+\.\d+\.\d+/u)) throw new Error('1')
}

const b = async () => {

  const [status] = await $.exec('fire-keeper-error')
  if (status) throw new Error('0')
}

// export
export { a, b }
