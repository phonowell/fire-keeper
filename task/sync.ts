import $copy_ from '../source/copy_'
import $getName from '../source/getName'
import $info from '../source/info'
import $isExisted_ from '../source/isExisted_'
import $isSame_ from '../source/isSame_'
import $prompt_ from '../source/prompt_'
import $read_ from '../source/read_'
import $source_ from '../source/source_'
import $stat_ from '../source/stat_'
import _uniq from 'lodash/uniq'

// interface

type Option = {
  title: string
  value: string
}

// function

const ask = async (
  source: string,
  target: string,
): Promise<string> => {

  const isExisted = [
    await $isExisted_(source),
    await $isExisted_(target),
  ]

  const mtime: [number, number] = [0, 0]
  if (isExisted[0]) {
    const stat = await $stat_(source)
    mtime[0] = stat
      ? stat.mtimeMs
      : 0
  }
  if (isExisted[1]) {
    const stat = await $stat_(target)
    mtime[1] = stat
      ? stat.mtimeMs
      : 0
  }

  const listChoice: Option[] = []

  if (isExisted[0])
    listChoice.push({
      title: [
        'overwrite, export',
        mtime[0] > mtime[1] ? '(newer)' : '',
      ].join(' '),
      value: 'export',
    })

  if (isExisted[1])
    listChoice.push({
      title: [
        'overwrite, import',
        mtime[1] > mtime[0] ? '(newer)' : '',
      ].join(' '),
      value: 'import',
    })

  if (!listChoice.length) {
    $info('skip')
    return 'skip'
  }

  let indexDefault = -1
  for (let i = 0; i < listChoice.length; i++) {
    if (!listChoice[i].title.includes('(newer)')) continue
    indexDefault = i
    break
  }

  listChoice.push({
    title: 'skip',
    value: 'skip',
  })

  return $prompt_({
    default: indexDefault,
    list: listChoice,
    message: 'and you decide to...',
    type: 'select',
  })
}

const load = async (): Promise<string[]> => {

  $info().pause()
  const listData = await Promise.all<string[]>(
    (await $source_('./data/sync/**/*.yaml'))
      .map(source => $read_(source)),
  )
  $info().resume()

  let result: string[] = []

  for (const data of listData)
    result = [
      ...result,
      ...data,
    ]

  return _uniq(result)
}

const main = async (): Promise<void> => {

  const data = await load()

  // diff
  for (const line of data) {

    const _list = line.split('@')
    const [path, extra] = [_list[0], _list[1] || '']

    const _list2 = extra.split('/')
    const [namespace, version] = [
      _list2[0] || 'default',
      _list2[1] || 'latest',
    ]

    const source = `./${path}`
    let target = `../midway/${path}`
    const { basename, dirname, extname } = $getName(target)
    target = `${dirname}/${basename}-${namespace}-${version}${extname}`

    // eslint-disable-next-line no-await-in-loop
    if (await $isSame_([source, target])) continue

    $info(`'${source}' is different from '${target}'`)

    // eslint-disable-next-line no-await-in-loop
    const value = await ask(source, target)
    if (!value) break

    // eslint-disable-next-line no-await-in-loop
    await overwrite(value, source, target)
  }
}

const overwrite = async (
  value: string,
  source: string,
  target: string,
): Promise<void> => {

  if (value === 'export') {
    const { dirname, filename } = $getName(target)
    await $copy_(source, dirname, filename)
  }

  if (value === 'import') {
    const { dirname, filename } = $getName(source)
    await $copy_(target, dirname, filename)
  }
}

// export
export default main