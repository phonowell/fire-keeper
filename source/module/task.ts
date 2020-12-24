import gulp from 'gulp'

// interface

type MapFunction = {
  [key: string]: Function
}

// function

function add(
  name: string, fn: Function
): void {

  gulp.task(name, fn as gulp.TaskFunction)
}

function get(): MapFunction
function get(name: string): Function
function get(
  name?: string
): MapFunction | Function {

  const map = (gulp as typeof gulp & {
    _registry: {
      _tasks: {
        [key: string]: {
          unwrap: () => Function
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

function main(): MapFunction
function main(name: string): Function
function main(name: string, fn: Function): void
function main(
  name?: string, fn?: Function
): MapFunction | Function | void {

  if (!name) return get()
  if (!fn) return get(name)
  add(name, fn)
}

// export
export default main