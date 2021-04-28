// interface

type OS = 'linux' | 'macos' | 'unknown' | 'windows'

// variable

let cache: OS

// function

function main(): OS
function main(os: OS): boolean
function main(
  os?: OS,
) {

  if (!cache) {
    const { platform } = process
    if (platform.includes('darwin')) cache = 'macos'
    else if (platform.includes('win')) cache = 'windows'
    else cache = 'unknown'
  }

  if (os) return os === cache
  return cache
}

// export
export default main