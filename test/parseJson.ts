import { $ } from './index'

// function

function a(): void {

  const string = 'a little message'
  const object = { message: string }
  const buffer = Buffer.from($.parseString(object))

  const result = $.parseJson<{ [key: string]: unknown }>(buffer)
  if (result.message !== string) throw new Error('0')
}

// export
export { a }