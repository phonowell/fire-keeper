import { $ } from './index'

// function

const a = () => {

  const string = '2021-1-1'

  const result = $.toDate(string)
  if (result.getTime() !== new Date(string).getTime()) throw new Error('0')
}

// export
export { a }