import { $, temp } from '..'

// function

async function a_() {

  $.i(temp)

  for (const key of ['a', 'b', 'c'])
    await $.write_(`${temp}/${key}.txt`, 'a little message')

  await $.zip_(`${temp}/*.txt`, '', {
    base: temp
  })

  if (!await $.isExisted_(`${temp}/temp.zip`)) throw new Error('0')
}

// export
export {
  a_
}