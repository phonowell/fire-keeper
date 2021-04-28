/* eslint-disable no-await-in-loop */
import { $, temp } from './index'
import isEqual from 'lodash/isEqual'

// function

const a_ = async (): Promise<void> => {

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

  const listDataSource: Buffer[] = []
  for (const it of listSource) {
    const data = await $.read_(it, { raw: true })
    if (!data) throw new Error('1')
    listDataSource.push(data)
  }

  const listDataTarget: Buffer[] = []
  for (const it of listTarget) listDataTarget.push(await $.read_<Buffer>(it))

  if (!isEqual(listDataSource, listDataTarget)) throw new Error('2')
}

// export
export { a_ }