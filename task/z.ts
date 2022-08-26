import $ from '../source/'

// variable

const temp = './temp'

// function

const main = async () => {
  await $.exec([
    '1',
    'pnpm -v'
  ])
}

// export
export default main
