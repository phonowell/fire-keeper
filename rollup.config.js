import { readFileSync } from 'fs'

import autoExternal from 'rollup-plugin-auto-external'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-ts'

const pkg = JSON.parse(readFileSync('./package.json'))

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
  glob: 'src/glob.ts',
  home: 'src/home.ts',
  isExist: 'src/isExist.ts',
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
  watch: 'src/watch.ts',
  wrapList: 'src/wrapList.ts',
  write: 'src/write.ts',
  zip: 'src/zip.ts',
  index: 'src/index.ts',
}

const config = [
  {
    input,
    output: {
      exports: 'named',
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
    },
    external: [
      /node_modules/,
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
      autoExternal(),
      resolve({
        extensions: ['.ts', '.js'],
      }),
      typescript({
        tsconfig: './tsconfig.esm.json',
        transpiler: 'typescript',
      }),
      commonjs(),
    ],
  },
  {
    input,
    output: {
      exports: 'named',
      dir: 'dist/cjs',
      format: 'cjs',
      preserveModules: true,
    },
    external: [
      /node_modules/,
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
      autoExternal(),
      resolve({
        extensions: ['.ts', '.js'],
      }),
      typescript({
        tsconfig: './tsconfig.cjs.json',
        transpiler: 'typescript',
      }),
      commonjs(),
    ],
  },
]

export default config
