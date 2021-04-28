import yargs from 'yargs'

// interface

type Argv = typeof yargs.argv

// function

const main = <T = {}>(): T & Argv => yargs.argv as T & Argv

// export
export default main