export default ->

  await $.fetchGitHub_ 'phonowell/kokoro'

  # clean

  listClean = [
    './coffeelint.yaml'
    './coffeelint.yml'
    './stylint.yaml'
    './stylintrc.yml'
  ]
  
  await $.info().silence_ ->
    await $.remove_ listClean

  # copy

  LIST = [
    '.gitignore'
    '.npmignore'
    '.stylintrc'
    'coffeelint.json'
    'license.md'
    'tslint.json'
  ]

  for filename in LIST

    source = "./../kokoro/#{filename}"
    target = "./#{filename}"

    isSame = await $.isSame_ [source, target]
    if isSame == true
      continue

    await $.copy_ source, './'
    await $.exec_ "git add -f #{$.root()}/#{filename}"

  @ # return