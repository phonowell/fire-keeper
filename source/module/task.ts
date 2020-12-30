import gulp from 'gulp'

// interface

type Fn = () => void

type MapFunction = {
  [key: string]: Fn
}

// function

function add(
  name: string, fn: Fn
): void {

  gulp.task(name, fn as gulp.TaskFunction)
}

function get(): MapFunction
function get(name: string): Fn
function get(
  name?: string
): MapFunction | Fn {

  const map = (gulp as typeof gulp & {
    _registry: {
      _tasks: {
        [key: string]: {
          unwrap: () => Fn
        }
      }
    }
  })._registry._tasks

  if (!name) {
    const result: MapFunction = {}
    for (const _name of Object.keys(map))
      result[_name] = map[_name].unwrap()
    return result
  }

  const result = map[name]
  if (!result) throw new Error(`task/error: invalid task '${name}'`)
  return result.unwrap()
}

function main(): MapFunction
function main(name: string): Fn
function main(name: string, fn: Fn): void
function main(
  name?: string, fn?: Fn
): MapFunction | Fn | void {

  if (!name) return get()
  if (!fn) return get(name)
  add(name, fn)
  return undefined
}

// export
export default main
