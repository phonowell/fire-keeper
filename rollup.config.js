import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import autoExternal from 'rollup-plugin-auto-external'
import del from 'rollup-plugin-delete'
import filesize from 'rollup-plugin-filesize'
import typescript from 'rollup-plugin-typescript2'

const config = [
  {
    input: { argv: 'source/argv.ts', backup: 'source/backup.ts', clean: 'source/clean.ts', copy: 'source/copy.ts', download: 'source/download.ts', exec: 'source/exec.ts', getBasename: 'source/getBasename.ts', getDirname: 'source/getDirname.ts', getExtname: 'source/getExtname.ts', getFilename: 'source/getFilename.ts', getName: 'source/getName.ts', glob: 'source/glob.ts', home: 'source/home.ts', index: 'source/index.ts', isExisted: 'source/isExisted.ts', isSame: 'source/isSame.ts', link: 'source/link.ts', log: 'source/log.ts', mkdir: 'source/mkdir.ts', normalizePath: 'source/normalizePath.ts', os: 'source/os.ts', prompt: 'source/prompt.ts', read: 'source/read.ts', recover: 'source/recover.ts', remove: 'source/remove.ts', rename: 'source/rename.ts', root: 'source/root.ts', say: 'source/say.ts', sleep: 'source/sleep.ts', stat: 'source/stat.ts', toArray: 'source/toArray.ts', toDate: 'source/toDate.ts', toJson: 'source/toJson.ts', toString: 'source/toString.ts', type: 'source/type.ts', watch: 'source/watch.ts', wrapList: 'source/wrapList.ts', write: 'source/write.ts', zip: 'source/zip.ts' },
    output: [
      {
        exports: 'named',
        dir: 'dist',
        format: 'cjs',
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
      filesize(),
    ],
  },
]

export default config