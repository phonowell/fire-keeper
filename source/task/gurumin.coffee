export default ->
  
  await $.fetchGitHub_ 'phonowell/gurumin'

  await $.remove_ './gurumin'
  await $.copy_ './../gurumin/source/**/*', './gurumin'

  @ # return