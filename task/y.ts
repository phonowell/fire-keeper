import $ from '../source'

// function

async function main_(): Promise<void> {

  await $.sleep_(1e3)
  $.i('y')
}

// export
export default main_
