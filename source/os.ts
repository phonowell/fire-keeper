// interface

type Os = 'macos' | 'unknown' | 'windows'

// variable

let cache: Os

// function

function main(): Os
function main(os: Os | Os[]): boolean
function main(
  os?: Os | Os[],
) {

  if (!cache) {
    const { platform } = process
    if (platform.includes('darwin')) cache = 'macos'
    else if (platform.includes('win')) cache = 'windows'
    else cache = 'unknown'
  }

  if (!os) return cache

  const listOs = os instanceof Array
    ? os
    : [os]

  for (let item of listOs) {
    if (cache === item) return true
  }
  return false
}

// export
export default main