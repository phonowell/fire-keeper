it "$.zip_('#{temp}/*.txt', '#{temp}', 'temp.zip')", ->
  await clean_()

  base = temp

  for key in ['a', 'b', 'c']

    source = "#{base}/#{key}.txt"
    content = "test file #{key}"

    await $.write_ source, content

  result = await $.zip_ "#{temp}/*.txt", temp, 'temp.zip'

  unless result == $
    throw 0

  unless await $.isExisted_ "#{temp}/temp.zip"
    throw 1

  await clean_()