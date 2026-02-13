import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  backup,
  clean,
  copy,
  download,
  exec,
  isSame,
  mkdir,
  move,
  read,
  recover,
  remove,
  rename,
  sleep,
  stat,
  write,
  zip,
} from '../src/index.js'

const TEMP_DIR = './temp/echo-option'
const tempFile = (name: string) => `${TEMP_DIR}/${name}`

const spyConsole = () =>
  vi.spyOn(console, 'log').mockImplementation(() => undefined)

describe('echo option', () => {
  beforeEach(async () => {
    await fse.remove(TEMP_DIR)
    await fse.ensureDir(TEMP_DIR)
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    await fse.remove(TEMP_DIR)
  })

  it('keeps echo enabled by default', async () => {
    const spy = spyConsole()
    await copy(`${TEMP_DIR}/missing-*.txt`)
    expect(spy).toHaveBeenCalled()
  })

  it('supports echo false in backup', async () => {
    const file = tempFile('backup.txt')
    await fse.outputFile(file, 'backup')

    const spy = spyConsole()
    await backup(file, { echo: false })

    expect(await fse.pathExists(`${file}.bak`)).toBe(true)
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in clean', async () => {
    const dir = tempFile('clean')
    const file = `${dir}/a.txt`
    await fse.outputFile(file, 'a')

    const spy = spyConsole()
    await clean(file, { echo: false })

    expect(await fse.pathExists(file)).toBe(false)
    expect(await fse.pathExists(dir)).toBe(false)
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in copy', async () => {
    const spy = spyConsole()
    await copy(`${TEMP_DIR}/missing-*.txt`, undefined, undefined, {
      echo: false,
    })
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in download', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(Buffer.from('download'), { status: 200 }),
        ),
    )

    const spy = spyConsole()
    await download('http://test.com/a.txt', TEMP_DIR, 'a.txt', { echo: false })

    expect(await fse.pathExists(tempFile('a.txt'))).toBe(true)
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in exec', async () => {
    const spy = spyConsole()
    await exec('cd .', { echo: false })
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in isSame', async () => {
    const a = tempFile('a.txt')
    const b = tempFile('b.txt')
    await fse.outputFile(a, 'same')
    await fse.outputFile(b, 'same')

    const spy = spyConsole()
    const result = await isSame(a, `${TEMP_DIR}/missing.txt`, { echo: false })

    expect(result).toBe(false)
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in mkdir', async () => {
    const dir = tempFile('dir-a')
    const spy = spyConsole()
    await mkdir(dir, { echo: false })
    expect(await fse.pathExists(dir)).toBe(true)
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in move', async () => {
    const source = tempFile('move-a.txt')
    const targetDir = tempFile('move-target')
    const target = `${targetDir}/move-a.txt`
    await fse.outputFile(source, 'move')
    await fse.ensureDir(targetDir)

    const spy = spyConsole()
    await move(source, targetDir, { echo: false })

    expect(await fse.pathExists(source)).toBe(false)
    expect(await fse.readFile(target, 'utf8')).toBe('move')
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in read', async () => {
    const spy = spyConsole()
    const result = await read(tempFile('missing.txt'), { echo: false })
    expect(result).toBeUndefined()
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in recover', async () => {
    const source = tempFile('recover.txt')
    const bak = `${source}.bak`
    await fse.outputFile(bak, 'recover')

    const spy = spyConsole()
    await recover(source, { echo: false })

    expect(await fse.readFile(source, 'utf8')).toBe('recover')
    expect(await fse.pathExists(bak)).toBe(false)
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in remove', async () => {
    const spy = spyConsole()
    await remove(tempFile('missing.txt'), { echo: false })
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in rename', async () => {
    const source = tempFile('rename-old.txt')
    const targetName = 'rename-new.txt'
    const target = tempFile(targetName)
    await fse.outputFile(source, 'rename')

    const spy = spyConsole()
    await rename(source, targetName, { echo: false })

    expect(await fse.pathExists(source)).toBe(false)
    expect(await fse.readFile(target, 'utf8')).toBe('rename')
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in sleep', async () => {
    const spy = spyConsole()
    await sleep(1, { echo: false })
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in stat', async () => {
    const spy = spyConsole()
    const result = await stat(tempFile('missing.txt'), { echo: false })
    expect(result).toBeNull()
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in write', async () => {
    const file = tempFile('write.txt')
    const spy = spyConsole()
    await write(file, 'write', {}, { echo: false })
    expect(await fse.readFile(file, 'utf8')).toBe('write')
    expect(spy).not.toHaveBeenCalled()
  })

  it('supports echo false in zip', async () => {
    const targetDir = tempFile('zip-target')
    await fse.ensureDir(targetDir)

    const spy = spyConsole()
    await zip(`${TEMP_DIR}/missing-*.txt`, targetDir, 'a.zip', { echo: false })

    expect(await fse.pathExists(`${targetDir}/a.zip`)).toBe(true)
    expect(spy).not.toHaveBeenCalled()
  })
})
