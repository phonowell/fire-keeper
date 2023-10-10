import echo from './echo'

// function

const main = async (delay = 0) => {
  await new Promise(resolve => setTimeout(resolve, delay))
  if (delay) echo('sleep', `slept '${delay} ms'`)
}

// export
export default main
