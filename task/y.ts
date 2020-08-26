import $ from '../source'

// function

async function main_() {
  const listModule = (await $.source_('./source/module/*.ts'))
    .map(it => $.getBasename(it))
  const listTest = (await $.source_('./test/module/*.ts'))
    .map(it => $.getBasename(it))
  for (const name of listModule) {
    if (listTest.includes(name)) continue
    $.i(name)
  }
}

// export
export default main_