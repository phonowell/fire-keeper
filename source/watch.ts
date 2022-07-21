import chokidar from 'chokidar'
import normalizePath from './normalizePath'

// function

const main = (listSource: string | string[], callback: (path: string) => void) => {
  chokidar.watch(listSource).on('all', (_event, path) => callback(normalizePath(path)))
}

// export
export default main