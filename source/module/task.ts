import gulp from 'gulp'

// interface

import { FnAsync } from '../type'

type MapFunction = {
  [key: string]: FnAsync
}

// function

class M {

  add(name: string, fn: FnAsync): void {
    gulp.task(name, fn as gulp.TaskFunction)
  }

  execute(): MapFunction
  execute(name: string): FnAsync
  execute(name: string, fn: FnAsync): void
  execute(name?: string, fn?: FnAsync): MapFunction | FnAsync | void {
    if (!name) return this.get()
    if (!fn) return this.get(name)
    this.add(name, fn)
  }

  get(): MapFunction
  get(name: string): FnAsync
  get(name?: string): MapFunction | FnAsync {

    const map = (gulp as typeof gulp & {
      _registry: {
        _tasks: {
          [key: string]: {
            unwrap: () => FnAsync
          }
        }
      }
    })._registry._tasks

    if (!name) {
      const result: MapFunction = {}
      for (const name of Object.keys(map))
        result[name] = map[name].unwrap()
      return result
    }

    const result = map[name]
    if (!result) throw new Error(`task/error: invalid task '${name}'`)
    return result.unwrap()
  }
}

// export
const m = new M()
export default m.execute.bind(m) as typeof m.execute