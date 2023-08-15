import $ from '../source/'

// function

const main = async () => {
  const listSource = await $.glob('./.gitignore')
  $.zip(listSource, './', 'test.zip')
}

// export
export default main
