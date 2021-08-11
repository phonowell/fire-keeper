/* eslint-disable no-await-in-loop */
import { $, temp } from '.'

// function

const a = async () => {

  $.i(temp)

  for (const key of ['a', 'b', 'c'])
    await $.write(`${temp}/${key}.txt`, 'a little message')

  await $.zip(`${temp}/*.txt`, '', {
    base: temp,
  })

  if (!await $.isExisted(`${temp}/temp.zip`)) throw new Error('0')
}

// export
export {
  a,
}
