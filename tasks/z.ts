import { watch } from '../src/index.js'

const main = () => {
  watch('./src', (file) => {
    console.log(`File changed: ${file}`)
  })
}

export default main
