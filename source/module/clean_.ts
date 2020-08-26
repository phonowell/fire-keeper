import $ from '..'

// function

async function main_(source: string | string[]): Promise<void> {
  const listSource = $.normalizePathToArray(source)
  await $.remove_(listSource)

  const dirname = $.getDirname(listSource[0])
  if ((await $.source_(`${dirname}/**/*`)).length) return
  await $.remove_(dirname)
}

// export
export default main_