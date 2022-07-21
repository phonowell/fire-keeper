import $ from '../source/'

// variable

const temp = './temp'

// function

const main = async () => {
  const a = await $.read('a.css', { raw: true })
}

// export
export default main