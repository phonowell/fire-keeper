import $ from '../source'

// function

async function compile_(): Promise<void> {
  await $.compile_([
    './source/**/*.ts',
    '!./source/type.ts',
  ], '.', {
    base: './source',
    minify: false,
  })
}

async function main_(): Promise<void> {
  await $.exec_('npm run clean')
  await compile_()
}

// export
export default main_
