it 'default', ->

  source = '~/Downloads/test.txt'
  {basename, dirname, extname, filename} = $.getName source

  unless basename == 'test'
    throw 1

  unless dirname == '~/Downloads'
    throw 2
  
  unless extname == '.txt'
    throw 3

  unless filename == 'test.txt'
    throw 4

it 'windows', ->

  source = 'C:\\Users\\mimiko\\Project\\fire-keeper\\readme.md'
  {basename, dirname, extname, filename} = $.getName source

  unless basename == 'readme'
    throw basename

  unless dirname == 'C:/Users/mimiko/Project/fire-keeper'
    throw dirname

  unless extname == '.md'
    throw extname

  unless filename == 'readme.md'
    throw filename