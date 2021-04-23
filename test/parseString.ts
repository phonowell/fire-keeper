import { $ } from './index'

// interface

type ListQuestion = [
  number,
  string,
  boolean,
  number[],
  { [key: string]: number },
  () => void,
  Date,
  Error,
  Buffer,
  null,
  undefined,
  typeof NaN,
]

// function

function a(): void {

  const listQuestion: ListQuestion = [
    42, // number
    'Aloha', // string
    true, // boolean
    [1, 2, 3], // array
    { a: 1, b: 2 }, // object
    () => null, // function
    new Date(), // date
    new Error('OK'), // error
    Buffer.from('String'), // buffer
    null, // null
    undefined, // undefined
    NaN, // NaN
  ]
  const listAnswer = [
    '42',
    'Aloha',
    'true',
    '[1,2,3]',
    '{"a":1,"b":2}',
    listQuestion[5].toString(),
    listQuestion[6].toString(),
    listQuestion[7].toString(),
    listQuestion[8].toString(),
    'null',
    'undefined',
    'NaN',
  ]
  for (let i = 0; i < listQuestion.length; i++) {
    const question = listQuestion[i]
    const answer = listAnswer[i]
    if ($.parseString(question) !== answer)
      throw new Error(`$.parseString(${question}) !== ${answer}`)
  }
}

// export
export { a }