import $ from '../source'

// function

async function main_(): Promise<void> {

  await $.exec_([
    'npm run build',
    'nrm use npm',
    // 'npm publish',
  ])
}

// export
export default main_
