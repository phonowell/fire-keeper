import { $ } from './index'

const a = async () => {
  const [code, result] = await $.exec('npm -v')

  if (code) throw new Error(code.toString())
  if (!~result.search(/\d+\.\d+\.\d+/u)) throw new Error('1')
}

const b = async () => {
  const [code] = await $.exec('fire-keeper-error')
  if (!code) throw new Error('0')
}

export { a, b }
