import $ from '../source/'

// variable

const temp = './temp'

// function

const main = async () => {
  $.watch('./source/**/*', (path) => $.echo(path))
}

// export
export default main
