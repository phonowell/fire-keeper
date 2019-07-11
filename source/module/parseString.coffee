export default (ipt) ->

  switch $.type ipt

    when 'array'

      (JSON.stringify __container__: ipt)
      .replace /{(.*)}/, '$1'
      .replace /"__container__":/, ''

    when 'object' then JSON.stringify ipt

    when 'string' then ipt

    else
    
      if ipt.toString
        return ipt.toString()
      new String ipt