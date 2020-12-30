import { $ } from '..'

// function

function a(): void {

  const string = 'a little message'
  const object = { message: string }
  const buffer = Buffer.from($.parseString(object))

  const result = $.parseJson(buffer) as { [key: string]: unknown }
  if (result.message !== string) throw new Error('0')
}

// export
export { a }
