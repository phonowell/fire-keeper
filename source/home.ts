import os from 'os'
import path from 'path'

// function

function main(): string {
  return path.normalize(os.homedir())
}

// export
export default main
