import os from 'os'

// function

const main = (): string => os.homedir()
  .replace(/\\/g, '/')

// export
export default main