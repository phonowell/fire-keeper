import os from 'os'

// function

function main(): string {
  return os.homedir()
    .replace(/\\/gu, '/')
}

// export
export default main
