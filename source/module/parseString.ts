import $ from '..'

// function

function main(input: unknown): string {

  if (typeof input === 'string')
    return input

  if (input instanceof Array)
    return (JSON.stringify({ __container__: input }))
      .replace(/{(.*)}/, '$1')
      .replace(/"__container__":/, '')

  if ($.type(input) === 'object')
    return JSON.stringify(input)

  if (input && (input as any).toString)
    return (input as any).toString()
  return String(input)
}

// export
export default main