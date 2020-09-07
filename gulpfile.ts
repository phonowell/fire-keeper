import $ from './source'
import fs from 'fs'

// interface
type FnAsync = (...args: any[]) => Promise<unknown>

// task
for (const filename of fs.readdirSync('./task')) {

  if (!filename.endsWith('.ts')) continue

  const name = filename.replace('.ts', '')
  $.task(name, async (...args: any[]) => {
    const fnAsync: FnAsync = (await import(`./task/${name}`)).default
    await fnAsync(...args)
  })
}