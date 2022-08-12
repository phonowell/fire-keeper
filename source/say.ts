import exec from './exec'
import log from './log'
import os from './os'
import toArray from './toArray'

// interface

type Option = {
  lang?: keyof typeof Lang
  voice?: typeof Lang[keyof typeof Lang]
}

// variable

const Lang = {
  ja: 'kyoko',
  'ja-jp': 'kyoko',
  zh: 'ting-ting',
  'zh-cn': 'ting-ting',
  'zh-hk': 'sin-ji',
  'zh-tw': 'mei-jia',
} as const

// function

const main = async (text: string, option: Option = {}) => {
  for (let message of toArray(text)) {
    log('say', message)

    if (os() !== 'macos') continue

    message = message.replace(/[#()-]/g, '').trim()

    if (!message) continue

    const listCmd = ['say']

    if (option.lang) listCmd.push(`--voice=${Lang[option.lang]}`)
    if (option.voice) listCmd.push(`--voice=${option.voice}`)

    listCmd.push(message)

    // eslint-disable-next-line no-await-in-loop
    await exec(listCmd.join(' '), { silent: true })
  }
}

// export
export default main
