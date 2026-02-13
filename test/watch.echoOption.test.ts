import { afterEach, describe, expect, it, vi } from 'vitest'

type Handler = (value: unknown) => void

class MockWatcher {
  private handlers = new Map<string, Handler[]>()

  close = () => Promise.resolve()

  emit = (event: string, value: unknown) => {
    const list = this.handlers.get(event) ?? []
    for (const handler of list) handler(value)
  }

  on = (event: string, handler: Handler) => {
    const list = this.handlers.get(event) ?? []
    list.push(handler)
    this.handlers.set(event, list)
    return this
  }
}

const watchers: MockWatcher[] = []

vi.mock('chokidar', () => ({
  watch: () => {
    const watcher = new MockWatcher()
    watchers.push(watcher)
    return watcher
  },
}))

import watch from '../src/watch.js'

describe('watch echo option', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    watchers.splice(0, watchers.length)
  })

  it('supports echo false on watcher error', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const unwatch = watch('./temp/watch-echo', () => undefined, { echo: false })
    const watcher = watchers.at(0)

    if (!watcher) throw new Error('watcher not initialized')

    watcher.emit('error', new Error('boom'))
    expect(spy).not.toHaveBeenCalled()

    await unwatch()
  })

  it('keeps echo enabled by default on watcher error', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const unwatch = watch('./temp/watch-echo', () => undefined)
    const watcher = watchers.at(0)

    if (!watcher) throw new Error('watcher not initialized')

    watcher.emit('error', new Error('boom'))
    expect(spy).toHaveBeenCalled()

    await unwatch()
  })
})
