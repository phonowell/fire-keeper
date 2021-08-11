import info from './info'

// function

const main = async (
  delay = 0,
): Promise<void> => {

  await new Promise(resolve => setTimeout(resolve, delay))
  if (delay) info('sleep', `slept '${delay} ms'`)
}

// export
export default main