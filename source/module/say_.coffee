$.say_ = (text, option = {}) ->

  type = $.type text
  listMessage = switch type
    when 'array' then text
    when 'boolean', 'number', 'string' then [text]
    else throw new Error "invalid type '#{type}'"

  for msg in listMessage

    $.info 'say', msg

    unless $.os == 'macos'
      continue

    msg = $.parseString msg
    .replace /[#\(\)-]/g, ''
    msg = _.trim msg

    unless msg.length
      continue

    listCmd = ['say']

    if option.lang
      lang = option.lang.toLowerCase()
      if name = $.say_.mapLang[lang]
        lang = name
      listCmd.push "--voice=#{lang}"

    if option.voice
      voice = option.voice.toLowerCase()
      listCmd.push "--voice=#{voice}"

    listCmd.push msg

    await $.exec_ (listCmd.join ' '),
      silent: true

  $ # return

$.say_.mapLang =
  'ja': 'kyoko'
  'ja-jp': 'kyoko'
  'zh': 'ting-ting'
  'zh-cn': 'ting-ting'
  'zh-hk': 'sin-ji'
  'zh-tw': 'mei-jia'

$.say_ # return
