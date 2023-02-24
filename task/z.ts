import $ from '../source/'

// function

const main = async () => {
  const target = new Error('ok')
  $.echo(typeof target, target instanceof Date)
  $.echo(target.toString())
  $.echo(String(target))
  $.echo($.toString(target))
}

// export
export default main
