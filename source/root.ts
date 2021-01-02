import path from 'path'

// function

function main(): string {
  return path.normalize(process.cwd())
}

// export
export default main
