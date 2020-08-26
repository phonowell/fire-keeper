import $ from './source'
import fs from 'fs'

// interface
type IFnAsync = (...args: any[]) => Promise<unknown>

// task
for (const filename of fs.readdirSync('./task')) {

  if (!filename.endsWith('.ts')) continue

  const name = filename.replace('.ts', '')
  $.task(name, async (...args: any[]) => {
    const fnAsync = (await import(`./task/${name}.ts`)).default as IFnAsync
    await fnAsync(...args)
  })
}