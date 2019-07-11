listQuestion = [
  1024 # number
  'hello world' # string
  true # boolean
  [1, 2, 3] # array
  {a: 1, b: 2} # object
  -> null # function
  -> await new Promise (resolve) -> resolve() # async function
  new Date() # date
  new Error() # error
  Buffer.from 'String' # buffer
  null # null
  undefined # undefined
  NaN # NaN
]

listAnswer = [
  'number'
  'string'
  'boolean'
  'array'
  'object'
  'function'
  'asyncfunction'
  'date'
  'error'
  'uint8array'
  'null'
  'undefined'
  'number'
]

for question, i in listQuestion
  do (question, i) ->

    name = "#{question}"

    it name, ->
      type = $.type question
      unless type == listAnswer[i]
        throw "type error: #{name} -> #{type}"