// function

function main(): string {
  return process.cwd()
    .replace(/\\/gu, '/')
}

// export
export default main
