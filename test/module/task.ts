import { $ } from '..'

// function

async function a_() {
  if (typeof a_ !== 'function') throw new Error('0')
  if (typeof $.task() !== 'object') throw new Error('1')
}

async function b_() {

  const fn_ = async () => await $.sleep_()
  $.task('_test', fn_)

  if ($.task('_test') !== fn_) throw new Error('0')
}

// export
export {
  a_,
  b_
}