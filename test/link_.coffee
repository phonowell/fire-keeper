it "$.link_('./source', '#{temp}/source')", ->
  await clean_()

  result = await $.link_ './source'
  , "#{temp}/source"

  unless result == $
    throw 0

  unless await $.isExisted_ "#{temp}/source"
    throw 1

  unless await $.isExisted_ "#{temp}/source/index.coffee"
    throw 2

  await clean_()