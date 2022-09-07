import $ from '../source/'

// variable

const temp = './temp'

// function

const main = async () => {
  const content = await $.read<Buffer>('./readme.txt', { raw: false })
}

// export
export default main
