# CLAUDE.md

Fire Keeper · Node.js/TS 文件系统库 · 纯 ESM · Node ≥24

简单任务用 haiku · 输出 tokens 5x 价格，惜字如金

## 核心约束

**仅默认导出** · **自动生成禁编辑** · **导入需 `.js`** · **改代码必改测试**

- `src/*.ts` 仅 `export default fn`
- `dist/` · `src/index.ts` · `package.json` exports · `rollup.config.js` input 自动生成禁编辑
- 相对导入必带 `.js`：`import x from './x.js'`
- 代码修改同步更新测试

## 常见坑

- 编辑自动生成文件 · 命名导出 · 导入忘 `.js` · 改代码忘改测试
- 数组索引不检查 `undefined`（`noUncheckedIndexedAccess`）
- 测试假定并行（实际串行） · `echo` 用绝对路径 · 测试第三方库非项目封装

## 开发流程

**命令**：`pnpm test` 串行 · `pnpm build` 测试→重写配置→打包 · `pnpm lint` · `pnpm task [name]`

**新增工具**：`src/<name>.ts` 默认导出 → `test/<name>.test.ts` → `pnpm build` 自动重写配置

**测试**：✅ 业务逻辑/参数验证/错误处理/项目特有功能（`ListSource` · `echo` 路径简化）/跨平台 · 🚫 第三方库/JS 原生/OS 输出/时间精度

**测试结构**：`src/x.ts` → `test/x.test.ts` · Vitest `fileParallelism: false` · 临时文件 `temp/<模块>/` + `beforeEach`/`afterEach` 清理 · `@/*` 仅测试用

## 架构细节

**模块**

- `import type { T }` · 优先 `type` 非 `interface`
- 数组访问返回 `T | undefined` 需检查：`const x = arr.at(0); if (!x) return`
- `glob()` 返回 `ListSource` 品牌类型缓存重用

**日志**

- `echo(tag, msg)` / `echo(msg)` · 路径简化：项目根 → `.` · 主目录 → `~`
- 静默：`echo.freeze(promise)` · `echo.whisper(fn)` · `echo.pause()`/`resume()`
- 无匹配：`echo('mod', 'no files found ...')` + 早返回

**文件操作模板**

```typescript
const fn = async (source: string | string[], { concurrency = 5 }: Options = {}) => {
  const listSource = await glob(source)
  if (!listSource.length) { echo('fn', `no files found matching ${wrapList(source)}`); return }
  await runConcurrent(concurrency, listSource.map(src => async () => { /* ... */ }))
  echo('fn', `processed ${wrapList(source)}`)
}
```

## 配置参考

**任务系统**：`tasks/index.ts` 动态发现 · 命名 `subdir@file` → 执行 `file/subdir` · 构建：测试失败→退出 → 重写配置 → 打包

**ESLint**：禁 `public` · 强制 `import type` · 优先 `type` 非 `interface` · 相对导入需 `.js` · 导入排序 · 移除未使用导入 · Prettier（无分号/单引号/尾随逗号）
