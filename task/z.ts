import $ from '../source/'

// variable

const temp = './temp'

// function

const main = async () => {
  const source = './license.md'
  const target = `${temp}/test.md`

  await $.copy(source, temp, 'test.md')
  if (!(await $.isExisted(target))) throw new Error('0')

  if (!(await $.isSame(source, target))) throw new Error('1')
}

// export
export default main
