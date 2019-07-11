describe 'file', ->

  describe 'single', ->

    it 'existed', ->
      await clean_()

      source = "#{temp}/a.txt"
      content = 'aloha'
      await $.write_ source, content

      unless await $.isExisted_ source
        throw 0

      await clean_()

    it 'not existed', ->
      await clean_()

      source = "#{temp}/a.txt"
      
      if await $.isExisted_ source
        throw 0

      await clean_()

  describe 'multi', ->

    it 'existed', ->
      await clean_()

      listSource = [
        "#{temp}/a.txt"
        "#{temp}/b.txt"
        "#{temp}/c.txt"
      ]
      content = 'aloha'
      for source in listSource
        await $.write_ source, content

      unless await $.isExisted_ listSource
        throw 0

      await clean_()

    it 'not existed', ->
      await clean_()

      listSource = [
        "#{temp}/a.txt"
        "#{temp}/b.txt"
        "#{temp}/c.txt"
      ]
      content = 'aloha'
      for source in listSource
        await $.write_ source, content

      await $.remove_ listSource[0]

      if await $.isExisted_ listSource
        throw 0

      await clean_()

describe 'folder', ->

  describe 'single', ->

    it 'existed', ->
      await clean_()

      source = "#{temp}/a"
      await $.mkdir_ source

      unless await $.isExisted_ source
        throw 0

      await clean_()

    it 'not existed', ->
      await clean_()

      source = "#{temp}/a"

      if await $.isExisted_ source
        throw 0

      await clean_()

  describe 'multi', ->

    it 'existed', ->
      await clean_()

      listSource = [
        "#{temp}/a"
        "#{temp}/b"
        "#{temp}/c"
      ]
      for source in listSource
        await $.mkdir_ source

      unless await $.isExisted_ listSource
        throw 0

      await clean_()

    it 'not existed', ->
      await clean_()

      listSource = [
        "#{temp}/a"
        "#{temp}/b"
        "#{temp}/c"
      ]
      for source in listSource
        await $.mkdir_ source

      await $.remove_ listSource[0]

      if await $.isExisted_ listSource
        throw 0

      await clean_()

describe 'file & folder', ->

  it 'existed', ->
    await clean_()

    await $.mkdir_ "#{temp}/a"
    await $.mkdir_ "#{temp}/b"
    await $.write_ "#{temp}/a/b.txt", 'aloha'

    unless await $.isExisted_ [
      "#{temp}/a"
      "#{temp}/a/b.txt"
      "#{temp}/b"
    ]
      throw 0

    await clean_()

  it 'not existed', ->
    await clean_()

    await $.write_ "#{temp}/a/b.txt", 'aloha'

    if await $.isExisted_ [
      "#{temp}/a"
      "#{temp}/a/b.txt"
      "#{temp}/b"
    ]
      throw 0

    await clean_()