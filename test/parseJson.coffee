it 'default', ->

  # Buffer.from('{message: 'a test line'}')

  string = 'a test line'
  object =
    message: string
  buffer = Buffer.from $.parseString object

  result = $.parseJson buffer
  unless result.message == 'a test line'
    throw 1