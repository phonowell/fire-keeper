import $ from '..'

// interface

type IOption = {
  lang?: keyof typeof Lang
  voice?: typeof Lang[keyof typeof Lang]
}

// variable

const Lang = {
  'ja': 'kyoko',
  'ja-jp': 'kyoko',
  'zh': 'ting-ting',
  'zh-cn': 'ting-ting',
  'zh-hk': 'sin-ji',
  'zh-tw': 'mei-jia'
} as const

// function

async function main_(text: string, option: IOption = {}): Promise<void> {
  for (let message of $.formatArgument(text)) {
    $.info('say', message)

    if (!$.os('macos')) continue

    message = message
      .replace(/[#\(\)-]/g, '')
      .trim()

    if (!message) continue

    const listCmd = ['say']

    if (option.lang)
      listCmd.push(`--voice=${Lang[option.lang]}`)

    if (option.voice)
      listCmd.push(`--voice=${option.voice}`)

    listCmd.push(message)

    await $.exec_(listCmd.join(' '), { silent: true })
  }
}

// export
export default main_