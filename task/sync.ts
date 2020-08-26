import $ from '../source'
import _ from 'lodash'

// interface

interface IChoice {
  title: string
  value: string
}

// function

class M {

  async ask_(source: string, target: string) {

    const isExisted = [
      await $.isExisted_(source),
      await $.isExisted_(target)
    ]

    const mtime = [0, 0]
    if (isExisted[0])
      mtime[0] = (await $.stat_(source)).mtimeMs
    if (isExisted[1])
      mtime[1] = (await $.stat_(target)).mtimeMs

    const choice = [] as {
      title: string
      value: string
    }[]

    if (isExisted[0])
      choice.push({
        title: [
          'overwrite, export',
          mtime[0] > mtime[1] ? '(newer)' : ''
        ].join(' '),
        value: 'export'
      })

    if (isExisted[1])
      choice.push({
        title: [
          'overwrite, import',
          mtime[1] > mtime[0] ? '(newer)' : ''
        ].join(' '),
        value: 'import'
      })

    if (!choice.length) {
      $.info('skip')
      return 'skip'
    }

    choice.push({
      title: 'skip',
      value: 'skip'
    })

    return await $.prompt_({
      list: choice,
      message: 'and you decide to...',
      type: 'select'
    })
  }

  async execute_() {

    const data = await this.load_()

    // diff
    for (const line of data) {

      const _list = line.split('@')
      const [path, extra] = [_list[0], _list[1] || '']

      const _list2 = extra.split('/')
      const [namespace, version] = [
        _list2[0] || 'default',
        _list2[1] || 'latest'
      ]

      const source = `./${path}`
      let target = `../midway/${path}`
      const { basename, dirname, extname } = $.getName(target)
      target = `${dirname}/${basename}-${namespace}-${version}${extname}`

      if (await $.isSame_([source, target])) continue

      $.info(`'${source}' is different from '${target}'`)

      const value = await this.ask_(source, target)
      if (!value) break

      await this.overwrite_(value, source, target)
    }
  }

  async load_() {

    $.info().pause()
    const listSource = await $.source_('./data/sync/**/*.yaml')
    const listData = [] as string[][]
    for (const source of listSource)
      listData.push(await $.read_(source) as string[])
    $.info().resume()

    let result = [] as string[]

    for (const data of listData)
      result = [
        ...result,
        ...data
      ]

    return _.uniq(result)
  }

  async overwrite_(value: string, source: string, target: string) {

    if (value === 'export') {
      const { dirname, filename } = $.getName(target)
      await $.copy_(source, dirname, filename)
    }

    if (value === 'import') {
      const { dirname, filename } = $.getName(source)
      await $.copy_(target, dirname, filename)
    }
  }
}

// export
export default async () => await (new M()).execute_()