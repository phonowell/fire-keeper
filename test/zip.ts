import { $, temp } from '.'

const a = async () => {
  console.log(temp)

  for (const key of ['a', 'b', 'c'])
    await $.write(`${temp}/${key}.txt`, 'a little message')

  await $.zip(`${temp}/*.txt`, '', {
    base: temp,
  })

  if (!(await $.isExist(`${temp}/temp.zip`))) throw new Error('0')
}

export { a }
