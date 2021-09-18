import yargs from 'yargs'

// interface

type Argv = {
  [x: string]: unknown
  _: (string | number)[]
  $0: string
}

// function

const main = <T = { [x: string]: unknown }>(): T & Argv => yargs.argv as T & Argv

// export
export default main