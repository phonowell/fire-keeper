import $ from '../source/'

// variable

const temp = './temp'

// function

const main = async () => {
  const pkg = await $.read('./readme.md', { raw: true })
}

// export
export default main
