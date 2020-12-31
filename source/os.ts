// interface

type OS = 'linux' | 'macos' | 'unknown' | 'windows'

// variable

let cache = '' as OS

// function

function main(): OS
function main(os: OS): boolean
function main(
  os?: OS
): OS | boolean {

  if (!cache) {
    const string = process.platform

    if (string.includes('darwin'))
      cache = 'macos'
    else if (string.includes('win'))
      cache = 'windows'
    else
      cache = 'unknown'
  }

  if (os) return os === cache

  return cache
}

// export
export default main
