import $ from '../source'

// function

const main = async (): Promise<void> => {

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
export default main
