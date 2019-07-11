Lang =
  'ja': 'kyoko'
  'ja-jp': 'kyoko'
  'zh': 'ting-ting'
  'zh-cn': 'ting-ting'
  'zh-hk': 'sin-ji'
  'zh-tw': 'mei-jia'

export default (text, option = {}) ->

  for msg in $.formatArgument text

    $.info 'say', msg

    unless $.os 'macos'
      continue

    msg = $.parseString msg
    .replace /[#\(\)-]/g, ''
    msg = _.trim msg

    unless msg.length
      continue

    listCmd = ['say']

    if option.lang
      lang = option.lang.toLowerCase()
      if name = Lang[lang]
        lang = name
      listCmd.push "--voice=#{lang}"

    if option.voice
      voice = option.voice.toLowerCase()
      listCmd.push "--voice=#{voice}"

    listCmd.push msg

    await $.exec_ (listCmd.join ' '),
      silent: true

  @ # return