import $ from '../source'

// function

async function compile_(): Promise<void> {
  await $.compile_([
    './source/**/*.ts',
    '!./source/type.ts',
  ], './dist', {
    base: './source',
    minify: false,
  })
}

async function main_(): Promise<void> {
  await prepare_()
  await compile_()
}

async function prepare_(): Promise<void> {
  await $.remove_('./dist')
}

// export
export default main_
