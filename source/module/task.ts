import gulp from 'gulp'

// interface

import { IFnAsync } from '../type'

type IMapFunction = {
  [key: string]: IFnAsync
}

// function

class M {

  add(name: string, fn: IFnAsync): void {
    gulp.task(name, fn as gulp.TaskFunction)
  }

  execute(): IMapFunction
  execute(name: string): IFnAsync
  execute(name: string, fn: IFnAsync): void
  execute(name?: string, fn?: IFnAsync): IMapFunction | IFnAsync | void {
    if (!name) return this.get()
    if (!fn) return this.get(name)
    this.add(name, fn)
  }

  get(): IMapFunction
  get(name: string): IFnAsync
  get(name?: string): IMapFunction | IFnAsync {

    const map = (gulp as typeof gulp & {
      _registry: {
        _tasks: {
          [key: string]: {
            unwrap: () => IFnAsync
          }
        }
      }
    })._registry._tasks

    if (!name) {
      const result: IMapFunction = {}
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