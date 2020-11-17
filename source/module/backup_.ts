import $ from '..'

// function

async function main_(
  source: string | string[]
): Promise<void> {

  const msg = `backed up ${$.wrapList(source)}`

  for (const src of await $.source_(source)) {
    const suffix = $.getExtname(src)
    const extname = '.bak'

    await $.info().whisper_(async () => {
      await $.copy_(src, '', { extname, suffix })
    })
  }

  $.info('backup', msg)
}

// export
export default main_