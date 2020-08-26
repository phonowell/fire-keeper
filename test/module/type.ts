import { $ } from '..'

// function

function a() {
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
    NaN // NaN
  ]
  const listAnswer = [
    'number',
    'string',
    'boolean',
    'array',
    'object',
    'function',
    'asyncfunction',
    'date',
    'error',
    'uint8array',
    'null',
    'undefined',
    'number'
  ]
  for (let i = 0; i < listQuestion.length; i++) {
    const question = listQuestion[i]
    const answer = listAnswer[i]
    if ($.type(question) !== answer)
      throw new Error(`$.type(${question}) !== ${answer}`)
  }
}

// export
export { a }