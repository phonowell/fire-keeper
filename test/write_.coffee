it "$.write_('#{temp}/wr/ite.txt', 'a test message')", ->
  await clean_()

  source = "#{temp}/wr/ite.txt"
  string = 'a test message'

  result = await $.write_ source, string

  unless result == $
    throw 0

  unless await $.isExisted_ source
    throw 1

  cont = await $.read_ source

  if cont != string
    throw 2

  await clean_()

it "$.write_('#{temp}/wr/ite.json', {message: 'a test message'})", ->
  await clean_()

  source = "#{temp}/wr/ite.json"
  string = 'a test message'
  object = message: string

  result = await $.write_ source, object

  unless result == $
    throw 0

  unless await $.isExisted_ source
    throw 1

  cont = await $.read_ source

  if cont.message != string
    throw 2

  await clean_()