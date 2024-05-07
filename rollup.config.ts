import autoExternal from 'rollup-plugin-auto-external'
import commonjs from '@rollup/plugin-commonjs'
import del from 'rollup-plugin-delete'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-ts'
import { visualizer } from 'rollup-plugin-visualizer'

const input = {
  argv: 'src/argv.ts',
  at: 'src/at.ts',
  backup: 'src/backup.ts',
  clean: 'src/clean.ts',
  copy: 'src/copy.ts',
  download: 'src/download.ts',
  echo: 'src/echo.ts',
  exec: 'src/exec.ts',
  getBasename: 'src/getBasename.ts',
  getDirname: 'src/getDirname.ts',
  getExtname: 'src/getExtname.ts',
  getFilename: 'src/getFilename.ts',
  getName: 'src/getName.ts',
  getType: 'src/getType.ts',
  glob: 'src/glob.ts',
  home: 'src/home.ts',
  isArray: 'src/isArray.ts',
  isAsyncFunction: 'src/isAsyncFunction.ts',
  isExist: 'src/isExist.ts',
  isFunction: 'src/isFunction.ts',
  isObject: 'src/isObject.ts',
  isSame: 'src/isSame.ts',
  link: 'src/link.ts',
  mkdir: 'src/mkdir.ts',
  move: 'src/move.ts',
  normalizePath: 'src/normalizePath.ts',
  os: 'src/os.ts',
  prompt: 'src/prompt.ts',
  read: 'src/read.ts',
  recover: 'src/recover.ts',
  remove: 'src/remove.ts',
  rename: 'src/rename.ts',
  root: 'src/root.ts',
  run: 'src/run.ts',
  sleep: 'src/sleep.ts',
  stat: 'src/stat.ts',
  toArray: 'src/toArray.ts',
  toDate: 'src/toDate.ts',
  toJSON: 'src/toJSON.ts',
  toString: 'src/toString.ts',
  watch: 'src/watch.ts',
  wrapList: 'src/wrapList.ts',
  write: 'src/write.ts',
  zip: 'src/zip.ts',
  index: 'src/index.ts',
}

const config = [
  {
    input,
    output: [
      {
        exports: 'named',
        dir: 'dist',
        format: 'cjs',
      },
      {
        exports: 'named',
        dir: 'dist/esm',
        format: 'esm',
      },
    ],
    plugins: [
      del({ targets: 'dist' }),
      autoExternal(),
      resolve(),
      typescript(),
      commonjs(),
      visualizer(),
    ],
  },
]

export default config
