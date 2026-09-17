# 整体优化计划

类型：implementation（A 内部质量 + B 行为改进 + 移除 radash，用户已确认）
基线：35 test files / 241 tests 全绿 → 最终 43 files / 256 tests 全绿

## 阶段

- [completed] P1 潜在 bug 修复
  - `trimEnd`：字符类 `join('|')` 把 `|` 混入剥离集合 → `join('')` 逐字符转义，补测试
  - `normalizePath`：删除 `__parent_directory__` 占位符（同名目录被改写），简化为 `~`/`.` 前缀 + `path.normalize`，补测试
  - `echo`：`regHome/regRoot` 全量正则转义（原仅转义 `\`）；`cahceTime` → `cacheTime`
  - `prompt`：`Save.type` `Omit` → `Exclude`
- [completed] P2 重构简化
  - `copy`：删 `listDirectSources`（glob `onlyFiles:false` 已覆盖字面目录）；`child()` 收敛为单 `fse.copy`；`asOptions` 统一 options 解析
  - `remove`：删 `listDirectSources`（glob `followSymbolicLinks:false` 已返回断链）
  - `findIndex`：去 `safeCopy`，原生 `findIndex` 转发
  - `isSame`：`echo.freeze` → `read({echo:false})`（保持逐文件静默语义）
  - `stat`/`rename`：回调 → `fse.stat`/`fse.move`
  - `exec`：`process` → `proc`；stdout/stderr 合并 `onData`
  - `clean`：目录空检查并行化
  - `toDate`：删冗余 ISO 分支；`flatten`：`flat(Infinity)`
- [completed] P3 行为改进
  - `read`：未知扩展名嗅探（`isUtf8` + 控制字节）→ Buffer : string
  - `watch`：glob 输入启动时解析后 `watcher.add`，同步返回关闭函数不变
  - `rename`：`fse.move` overwrite，跨设备兜底
  - `zip`：base 取所有源公共父目录；字面目录展开 `/**`（修复 zip('dir') 空包存量 bug）；archive 出错销毁 output；entry 名去前导 `/`
- [completed] P4 依赖与配置
  - radash 移除：`get`→`at` 内联、`trim`→正则、`debounce`→`watch` 内联；package.json + lockfile 已清
  - `pnpm-workspace.yaml` 加 `onlyBuiltDependencies: [esbuild]`（pnpm 11 不读 package.json pnpm 字段）；修复 `pnpm test/build` 无 TTY 失败
  - 删 `.npmignore`（`files` 字段覆盖）
- [completed] P5 测试缺口与验证
  - 新增：trimEnd `|`、normalizePath `__parent_directory__`、read 嗅探、watch glob、copy 目录 glob、zip 非空断言
  - 新文件：argv/getBasename/getDirname/getExtname/getFilename/run/toArray/index 测试
  - `pnpm lint` ✓ `pnpm test` ✓ `pnpm build` ✓（rollup + d.ts 全链路）
  - 文档同步：readme/usage 的 watch glob 说明

## 第二轮：工具链现代化（用户追加）

- [completed] M1 移除 eslint/prettier/rollup 全家桶：删 `eslint.config.mjs`/`rollup.config.js`/`tsconfig.declaration.json`，devDeps 只留 `oxlint`/`oxlint-tsgolint`/`oxfmt`/`tsdown`/`publint`/`tsx`/`typescript`/`vitest`/`@types/*`
- [completed] M2 `.oxlintrc.json` 精简版：plugins `import`/`typescript`/`unicorn`/`vitest`，默认 correctness + 7 条项目规则（`import/extensions`、`prefer-node-protocol`、`no-non-null-assertion`、`no-public`、`import type`、`type` 别名、`no-duplicates`）；`--type-aware` 需 `oxlint-tsgolint`；test/ override 关闭噪音 vitest 规则 + `valid-expect maxArgs:2`
- [completed] M3 `.oxfmtrc.json`：semi:false/singleQuote/trailingComma:all/sortImports；全仓 111 文件重排（含 md/yaml/package.json 字段序）
- [completed] M4 tsdown 取代 rollup：`entry:'src/*.ts'` + `unbundle:true` + `dts:true` + `outExtensions→.js/.d.ts` + `exports.packageJson` 自动重写 exports 表 + `publint` 校验；`tasks/build.ts` 删 rollup/tsc/replacePackage 三段
- [completed] M5 kleur→ansis（getter 链式 `ansis.cyan.underline`）；全部内置模块 `node:` 前缀；`verbatimModuleSyntax:true`；删 `baseUrl`（tsgolint 拒绝，`paths` 独立生效）
- [completed] M6 类型感知 lint 修复：`unwatch()` 悬空 Promise→测试 `await`；`at` `unknown|undefined`→`unknown`；`new Array(n)`→`Array.from`/`[]`；稀疏数组字面量→`undefined`；`archive.finalize()`→`void`；`tasks/index.ts` `main()`→顶层 `await`；eslint-disable 注释→oxlint-disable
  - 最终：`pnpm lint` 0/0 · `pnpm test` 43/256 全绿 · `pnpm build` tsdown 82 文件 + publint clean

## 第三轮：质量缺口补齐

- [completed] G1 `.github/workflows/ci.yml`：push/PR 触发 pnpm install→lint→test→build（Node 24）；package.json 加 `packageManager: pnpm@11.8.0`；dependency-review 的 checkout@v3/action@v2 → v4
- [completed] G2 `noImplicitAny` 显式 `false` 删除（strict 已隐含，tsc 零暴露）
- [completed] G3 薄测试补齐：getName 3→10（UNC/反斜杠/尾斜杠/隐藏文件/根路径/Unicode/结尾点）；4 个 wrapper 各补边界与空输入抛错；argv 1→5（stub process.argv：长选项/位置参数/`--key=value`/数字/短选项/布尔否定/`--` 分隔符实际语义）；prompt 2→17（`prompts.inject` 无头测试：7 类型往返/default 回落/pickDefault 索引与负值与按值匹配与越界收敛/id 缓存回读/multi 不写缓存/类型不匹配不复用缓存）→ 291 tests
- [completed] G4 prompts 换代评估 → 保留：`@clack/prompts` 缺 `number`/`toggle`，`@inquirer/prompts` 缺 `toggle`/`autocomplete` 等价物，换代需 shim 且改交互 UX；prompts 于 Node 24 功能正常，结论记 notes
- [completed] G5 验证：lint 0/0 · test 43/291 · build+publint clean
