import $ from '../source/index'

// variable

const list = [1, 2, 3, 4]

// function

const main = async (): Promise<void> => {

  const a = await $.prompt({
    list,
    type: 'select',
  })
  console.log(a)

  const b = await $.prompt({ type: 'text' })
  console.log(b)
}

// export
export default main