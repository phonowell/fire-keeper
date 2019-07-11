export default (name) ->

  source = $.normalizePath "./../#{name.split('/')[1]}"

  if await $.isExisted_ source
    return await $.exec_ [
      "cd #{source}"
      'git fetch'
      'git pull'
    ]

  await $.exec_ "git clone
  https://github.com/#{name}.git
  #{source}"