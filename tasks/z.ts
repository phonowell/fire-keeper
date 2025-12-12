import { glob } from '../src/index.js'

const main = async () => {
  const list = await glob('.claude/**/*')
  console.log(list)
}

export default main
