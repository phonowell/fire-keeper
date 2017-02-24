$$.argv = $p.yargs.argv

# os
$$.os = do ->
  string = process.platform
  if ~string.search 'darwin' then 'macos'
  else if ~string.search 'win' then 'windows'
  else 'linux'

# base
$$.base = process.cwd()

# path
$$.path =
  gulp: './gulpfile.js'
  source: './source'
  build: './build'
  secret: './secret'

$$.path.jade = "#{$$.path.source}/**/*.jade"
$$.path.stylus = "#{$$.path.source}/**/*.styl"
$$.path.coffee = "#{$$.path.source}/**/*.coffee"
$$.path.yaml = "#{$$.path.secret}/**/*.yml"