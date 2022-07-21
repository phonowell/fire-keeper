import { $ } from './index'

// function

const a = () => {

  const string = 'a little message'
  const object = { message: string }
  const buffer = Buffer.from($.toString(object))

  const result = $.toJson(buffer) as { message: string }
  if (result.message !== string) throw new Error('0')
}

// export
export { a }