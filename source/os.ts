// interface

type Os = 'macos' | 'unknown' | 'windows' | ''

type Result<T> = T extends void ? Os : boolean

// variable

let cache: Os = ''

// function

const main = <T extends Os | Os[] | void = void>(
  os?: T,
): Result<T> => {

  if (!cache) {
    const { platform } = process
    if (platform.includes('darwin')) cache = 'macos'
    else if (platform.includes('win')) cache = 'windows'
    else cache = 'unknown'
  }

  if (!os) {
    const result: Result<void> = cache
    return result as Result<T>
  }

  const listOs = os instanceof Array ? os : [os]

  for (const item of listOs) {
    if (cache === item) {
      const result: Result<Os> = true
      return result as Result<T>
    }
  }

  const result: Result<Os> = false
  return result as Result<T>
}

// export
export default main