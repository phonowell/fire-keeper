// interface

type Os = 'macos' | 'unknown' | 'windows' | ''

// variable

let cache: Os = ''

// function

const main = (): Os => {
  if (cache) return cache

  const { platform } = process
  if (platform.includes('darwin')) cache = 'macos'
  else if (platform.includes('win')) cache = 'windows'
  else cache = 'unknown'

  return cache
}

// export
export default main
