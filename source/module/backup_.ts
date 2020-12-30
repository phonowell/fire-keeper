import $ from '..'

// function

async function main_(
  source: string | string[]
): Promise<void> {

  const msg = `backed up ${$.wrapList(source)}`

  async function sub_(
    src: string
  ): Promise<void> {

    const suffix = $.getExtname(src)
    const extname = '.bak'

    await $.info().whisper_(async () => {
      await $.copy_(src, '', { extname, suffix })
    })
  }
  await Promise.all((await $.source_(source)).map(sub_))

  $.info('backup', msg)
}

// export
export default main_
