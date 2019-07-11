it 'default', ->

  listQuestion = [
    1024 # number
    'hello world' # string
    true # boolean
    [1, 2, 3] # array
    {a: 1, b: 2} # object
    -> null # function
    new Date() # date
    new Error 'All Right' # error
    Buffer.from 'String' # buffer
    null # null
    undefined # undefined
    NaN # NaN
  ]

  listAnswer = [
    '1024'
    'hello world'
    'true'
    '[1,2,3]'
    '{"a":1,"b":2}'
    listQuestion[5].toString()
    listQuestion[6].toString()
    listQuestion[7].toString()
    listQuestion[8].toString()
    'null'
    'undefined'
    'NaN'
  ]

  for question, i in listQuestion
    do (question, i) ->

      name = "#{question}"

      it name, ->

        result = $.parseString question
        unless result == listAnswer[i]
          throw name