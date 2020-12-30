import $ from '../source'

// function

async function main_(): Promise<void> {

  await $.exec_([
    'npm run alice y',
    'nrm use npm',
    'npm run alice x',
  ])
}

// export
export default main_
