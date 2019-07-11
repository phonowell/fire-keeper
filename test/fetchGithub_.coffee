it 'default', ->

  type = $.type $.fetchGithub_
  unless type == 'asyncfunction'
    throw 0