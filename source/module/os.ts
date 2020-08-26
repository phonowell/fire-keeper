// interface

type IOS = 'linux' | 'macos' | 'unknown' | 'windows'

// variable

let cache = '' as IOS

// function

function main(): IOS
function main(os: IOS): boolean
function main(os?: IOS) {

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