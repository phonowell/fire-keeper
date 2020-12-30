/* eslint-disable no-await-in-loop */
import { $, temp } from '..'
import isEqual from 'lodash/isEqual'

// function

async function a_(): Promise<void> {
  await $.copy_([
    './license.md',
    './readme.md',
  ], temp)

  const listSource = [
    `${temp}/license.md`,
    `${temp}/readme.md`,
  ]

  const listTarget = [
    `${temp}/license.md.bak`,
    `${temp}/readme.md.bak`,
  ]

  await $.backup_(listSource)
  if (!await $.isExisted_(listTarget)) throw new Error('0')

  const listDataSource = [] as Uint8Array[]
  for (const it of listSource)
    listDataSource.push(await $.read_(it, { raw: true }) as Uint8Array)
  const listDataTarget = [] as Uint8Array[]
  for (const it of listTarget)
    listDataTarget.push(await $.read_(it) as Uint8Array)
  if (!isEqual(listDataSource, listDataTarget)) throw new Error('1')
}

// export
export { a_ }
