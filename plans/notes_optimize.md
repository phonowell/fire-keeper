# 整体优化备注

- 范围：A（内部质量）+ B（行为改进）+ 移除 radash；fs-extra 保留
- 验证：`pnpm lint` ✓ `pnpm test` 43 文件 256 用例 ✓ `pnpm build` ✓
- 存量 bug 已修：`zip('dir')` 曾产空包（`glob(onlyFiles)` 不匹配字面目录，旧测试以 size>0 误判）；`trimEnd` 多字符 chars 误删 `|`；`normalizePath` 占位符误伤同名目录
- 保留契约：`root()` 校验有测试锁定；`mkdir([])` 静默返回是测试断言；`getName` UNC 尾斜杠无测试保留
- `watch` glob 为启动时快照解析：监听开始后新建但匹配模式的文件不会被监听；含 `[`/`?` 的字面文件名会被当模式（罕见取舍）
- `at` 内联 `get` 不支持 `a["b c"]` 引号键（radash 支持）；`.`/`[i]` 路径测试全覆盖
- `read` 嗅探边界：UTF-16 文本、含 ESC 外的 C0 控制字节文件会判二进制；ANSI 日志（ESC=27 放行）判文本
- `isSame` 保持 read 逐文件静默（`echo:false`），`stat` not-found 提示仍受 echo 控制
- pnpm 11 配置位：`onlyBuiltDependencies` 必须在 `pnpm-workspace.yaml`，package.json `pnpm` 字段已废弃（实测告警）

## 现代化迁移备注

- `oxlint --type-aware` 依赖 `oxlint-tsgolint` 包；tsgolint 拒绝 `baseUrl`（`paths` 相对 tsconfig 独立生效，TS≥4.1 即支持）
- tsdown 默认产 `.mjs`/`.d.mts`；`outExtensions: () => ({js:'.js', dts:'.d.ts'})` 保持旧结构，`exports.packageJson` 自动重写 exports（替代原 `replacePackage`），`main` 字段被移除（ESM-only 无需 legacy 字段，publint 认可）
- `unbundle:true` 保持逐文件产物，等价旧 rollup `preserveModules`；`dts:true` 替代独立 tsc declaration pass
- ansis 为 getter 链式（chalk 风格）：`ansis.cyan.underline(x)` 非 `cyan().underline()`
- oxlint 兼容 `eslint-disable` 注释，但已统一改 `oxlint-disable-next-line typescript/<rule>`；vitest 插件的 `valid-expect` 对 `expect(x, msg)` 双参误报 → `maxArgs:2`
- oxfmt 会重排 package.json 字段序与 md/yaml，已在 `lint` 脚本内自动应用
- lockfile 中 `rollup`（vite 传递）与 `kleur`（prompts/@types/prompts 传递）为间接依赖，非直接引用

## 缺口补齐备注

- `prompts.inject([v])` 无头测试：`undefined` → 返回 `initial`（text=默认字符串，select=初始**索引**非值，number=min 回落）；注入值原样返回
- yargs 行为事实（已锁测试）：`--flag` 后跟随位置参数会被吞噬为 flag 值；`--` 后参数进 `_`（populate-- 默认关）；`--no-x` → `x:false`
- prompts 保留理由：无维护中的 ESM 库原生覆盖全部 7 类型（auto/multi/select/text/number/confirm/toggle）；`kleur` 经 prompts 传递存在属正常
- `noImplicitAny:false` 原为冗余覆盖（strict 隐含 true），删除后零暴露
