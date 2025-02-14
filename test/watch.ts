import { $ } from './index'

const a = () => {
  if (typeof $.watch !== 'function') throw new Error('watch function not found')
}
a.description = 'watch exists'

export { a }
