import { watch } from '../src'

const a = () => {
  if (typeof watch !== 'function') throw new Error('watch function not found')
}
a.description = 'watch exists'

export { a }
