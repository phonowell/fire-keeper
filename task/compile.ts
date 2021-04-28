import $ from '../source'

// function

const compile = async (): Promise<void> => {
  await $.compile_('./source/**/*.ts', '.', {
    base: './source',
    minify: false,
  })
}

const main = async (): Promise<void> => {
  await $.exec_('npm run clean')
  await compile()
}

// export
export default main
