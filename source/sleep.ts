import log from './log'

// function

const main = async (delay = 0) => {
  await new Promise(resolve => setTimeout(resolve, delay))
  if (delay) log('sleep', `slept '${delay} ms'`)
}

// export
export default main
