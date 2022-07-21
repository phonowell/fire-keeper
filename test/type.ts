import { $ } from './index'

// variable

const listAnswer = [
  'number',
  'string',
  'boolean',
  'array',
  'object',
  'function',
  'function',
  'date',
  'error',
  'uint8array',
  'null',
  'undefined',
  'number',
] as const

const listQuestion = [
  42, // number
  'Aloha', // string
  true, // boolean
  [1, 2, 3], // array
  { a: 1, b: 2 }, // object
  () => null, // function
  async () => null, // async function
  new Date(), // date
  new Error(), // error
  Buffer.from('String'), // buffer
  null, // null
  undefined, // undefined
  NaN, // NaN
] as const

// function

const a = () => {
  for (let i = 0; i < listQuestion.length; i++) {
    const question = listQuestion[i]
    const answer = listAnswer[i]
    if ($.type(question) === answer) console.log(`$.type(${question}) === ${answer}`)
    else throw new Error(`$.type(${question}) !== ${answer}`)
  }
}

// export
export { a }