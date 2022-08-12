import $ from '../source/'

// function

const main = () => {
  $.watch(['./source/**/*.ts', '!**/test/**/*.ts'], path => console.log(path))
}

// export
export default main
