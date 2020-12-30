import { $ } from '..'

// function

function a(): void {
  const question = ['a', 'b', 'c']
  const answer = "'a', 'b', 'c'"
  if ($.wrapList(question) !== answer) throw new Error('0')
}

// export
export { a }
