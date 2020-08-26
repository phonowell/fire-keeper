import $ from '..'

// function

async function main_(): Promise<unknown> {

  const list = Object.keys($.task()).sort()

  $.info('task', $.wrapList(list))

  const name = await $.prompt_({
    id: 'default-gulp',
    list,
    message: 'task',
    type: 'auto'
  })

  if (!name) return

  return await $.task(name)()
}

// export
export default main_