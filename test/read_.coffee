it './temp/test.txt', ->
  await clean_()

  source = "#{temp}/test.txt"
  string = 'a test message'

  await $.write_ source, string

  cont = await $.read_ source

  unless cont == string
    throw 0

  await clean_()

it './temp/test.json', ->
  await clean_()

  source = "#{temp}/test.json"
  string = 'a test message'
  object =
    message: string

  await $.write_ source, object

  cont = await $.read_ source

  unless cont.message == string
    throw 0

  await clean_()

it './temp/null.txt', ->
  await clean_()

  cont = await $.read_ "#{temp}/null.txt"

  if cont?
    throw 0
  
  await clean_()

it './temp/raw.json', ->
  await clean_()

  source = "#{temp}/raw.json"
  string = 'a test message'

  await $.write_ source, string

  cont = await $.read_ source,
    raw: true

  unless ($.type cont) == 'uint8array'
    throw 0

  cont = $.parseString cont

  unless cont == string
    throw 1

  await clean_()

it './temp/test.yaml', ->
  await clean_()

  source = "#{temp}/test.yaml"
  string = 'a test message'

  await $.write_ source, "- value: #{string}"

  cont = await $.read_ source
  
  type = $.type cont
  unless type == 'array'
    throw "invalid type '#{type}'"

  value = _.get cont, '[0].value'
  unless value == string
    throw "invalid value '#{value}'"

  await clean_()