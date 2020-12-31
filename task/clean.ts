import $ from '../source'

// function

async function main_(): Promise<void> {

  await Promise.all((await $.source_('./source/*.ts')).map(
    source => (async () => {
      const basename = $.getBasename(source)
      await $.remove_([
        `./${basename}.js`,
        `./${basename}.d.ts`,
      ])
    })()
  ))
}

// export
export default main_
