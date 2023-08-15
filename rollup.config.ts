import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import autoExternal from 'rollup-plugin-auto-external'
import del from 'rollup-plugin-delete'
import typescript from 'rollup-plugin-typescript2'

const input = {
  argv: 'source/argv.ts',
  at: 'source/at.ts',
  backup: 'source/backup.ts',
  clean: 'source/clean.ts',
  copy: 'source/copy.ts',
  download: 'source/download.ts',
  echo: 'source/echo.ts',
  exec: 'source/exec.ts',
  getBasename: 'source/getBasename.ts',
  getDirname: 'source/getDirname.ts',
  getExtname: 'source/getExtname.ts',
  getFilename: 'source/getFilename.ts',
  getName: 'source/getName.ts',
  getType: 'source/getType.ts',
  glob: 'source/glob.ts',
  home: 'source/home.ts',
  isAsyncFunction: 'source/isAsyncFunction.ts',
  isExist: 'source/isExist.ts',
  isFunction: 'source/isFunction.ts',
  isSame: 'source/isSame.ts',
  link: 'source/link.ts',
  mkdir: 'source/mkdir.ts',
  move: 'source/move.ts',
  normalizePath: 'source/normalizePath.ts',
  os: 'source/os.ts',
  prompt: 'source/prompt.ts',
  read: 'source/read.ts',
  recover: 'source/recover.ts',
  remove: 'source/remove.ts',
  rename: 'source/rename.ts',
  root: 'source/root.ts',
  run: 'source/run.ts',
  sleep: 'source/sleep.ts',
  stat: 'source/stat.ts',
  toArray: 'source/toArray.ts',
  toDate: 'source/toDate.ts',
  toJson: 'source/toJson.ts',
  toString: 'source/toString.ts',
  watch: 'source/watch.ts',
  wrapList: 'source/wrapList.ts',
  write: 'source/write.ts',
  zip: 'source/zip.ts',
  index: 'source/index.ts',
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
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'esnext',
            target: 'es5',
          },
        },
      }),
      resolve(),
      commonjs(),
    ],
  },
]

export default config
