import { $ } from './index'

const a = () => {
  const question = ['a', 'b', 'c']
  const answer = "'a', 'b', 'c'"
  if ($.wrapList(question) !== answer) throw new Error('0')
}

export { a }
