it "$.recover_('#{temp}/readme.md')", ->
  await clean_()

  source = "#{temp}/readme.md"
  target = "#{temp}/readme.md.bak"

  await $.chain $
  .copy_ './readme.md', temp
  .backup_ source
  .remove_ source

  result = await $.recover_ source
  unless result == $
    throw 0

  unless await $.isExisted_ source
    throw 1

  await clean_()