import $compile from '../source/compile'
import $exec from '../source/exec'

// function

const compile = async (): Promise<void> => {
  await $compile('./source/**/*.ts', '.', {
    base: './source',
    minify: false,
  })
}

const main = async (): Promise<void> => {
  await $exec('npm run clean')
  await compile()
}

// export
export default main
