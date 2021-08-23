import $ from '../source'

// function

const main = async () => {
  const txt = await $.read('a.txt') // return string
  const json = await $.read('a.json') // return object
  const other = await $.read('a.other') // return buffer
  const n = await $.read<number>('a.txt') // overwrite, return number

  const source = `${123}.txt`
  const txt2 = await $.read(`${123}.txt`) // return string
  const txt3 = await $.read(source) // return buffer
}

// export
export default main