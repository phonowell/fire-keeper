import $ from '../source'

// function

const main = async () => {

  // const resultConfirm = await $.prompt_({
  //   default: true,
  //   type: 'confirm',
  // })
  // console.log(resultConfirm)

  const resultNumber = await $.prompt_({
    default: 2,
    max: 3,
    min: 1,
    type: 'number',
  })
  console.log(resultNumber)

  // const resultText = await $.prompt_({
  //   default: 'aloha',
  //   type: 'text',
  // })
  // console.log(resultText)

  // const resultToggle = await $.prompt_({
  //   default: '关',
  //   off: '关',
  //   on: '开',
  //   type: 'toggle',
  // })
  // console.log(resultToggle)

  const resultSelect = await $.prompt_({
    default: -1,
    list: [1, 2, 3],
    type: 'select',
  })
  console.log(resultSelect)
}

// export
export default main