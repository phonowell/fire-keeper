import os from 'os'

// function

const main = () => os.homedir().replace(/\\/g, '/')

// export
export default main
