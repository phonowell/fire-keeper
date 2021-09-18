import $ from '../source/index'

// variable

const list = [1, 2, 3, 4]

// function

const main = async (): Promise<void> => {
  const result = await $.prompt({
    list,
    type: 'select',
  })
  console.log(result)
}

// export
export default main