export default ->

  await $.fetchGitHub_ 'phonowell/kokoro'

  # clean

  listClean = [
    './coffeelint.yaml'
    './coffeelint.yml'
    './stylint.yaml'
    './stylintrc.yml'
    './tslint.json'
  ]
  
  await $.info().silence_ ->
    await $.remove_ listClean

  # copy

  listCopy = [
    '.gitignore'
    '.npmignore'
    '.stylintrc'
    'coffeelint.json'
    'license.md'
  ]

  for filename in listCopy

    source = "./../kokoro/#{filename}"
    target = "./#{filename}"

    isSame = await $.isSame_ [source, target]
    if isSame == true
      continue

    await $.copy_ source, './'
    await $.exec_ "git add -f #{$.root()}/#{filename}"

  @ # return