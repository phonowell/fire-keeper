import $ from '../source/index'

// function

const main = async (): Promise<void> => {

  await Promise.all((await $.source('./source/*.ts')).map(
    source => (async () => {
      const basename = $.getBasename(source)
      await $.remove([
        `./${basename}.js`,
        `./${basename}.d.ts`,
      ])
    })()
  ))
}

// export
export default main
