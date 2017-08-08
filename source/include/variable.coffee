###

  argv
  os
  base

###

$$.argv = $p.yargs.argv

$$.os = switch
  when ~(string = process.platform).search 'darwin' then 'macos'
  when ~string.search 'win' then 'windows'
  else 'linux'

$$.base = process.cwd()