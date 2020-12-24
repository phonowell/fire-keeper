import $ from '..'

// function

async function main_(
  delay = 0
): Promise<void> {

  await new Promise(resolve => setTimeout(() => resolve(true), delay))
  if (delay) $.info('sleep', `slept '${delay} ms'`)
}

// export
export default main_