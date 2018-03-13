###
argv
os
path
###

$$.argv = $p.yargs.argv

$$.os = switch
  when ~(string = process.platform).search 'darwin' then 'macos'
  when ~string.search 'win' then 'windows'
  else 'linux'

$$.path =
  base: process.cwd()
  home: require('os').homedir()