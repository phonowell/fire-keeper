import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  dts: true,
  entry: 'src/*.ts',
  exports: {
    packageJson: true,
  },
  format: 'esm',
  outExtensions: () => ({ dts: '.d.ts', js: '.js' }),
  platform: 'node',
  publint: true,
  unbundle: true,
})
