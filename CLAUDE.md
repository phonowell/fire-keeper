# CLAUDE.md

本文件为 Claude Code 提供在此仓库中工作的指导。

Fire Keeper - Node.js/TypeScript 轻量工具库 · 40+ 文件系统/通用辅助函数 · 纯 ESM · Node ≥ 24

## 核心原则（必读）

**仅默认导出** · **自动生成禁编辑** · **导入需 `.js`** · **修改必更新测试**

- 每个 `src/*.ts` 仅 `export default myFunction`（禁止命名导出）
- `dist/`、`src/index.ts`、`package.json` exports、`rollup.config.js` input 自动生成，禁止手动编辑
- 相对导入必须 `.js` 扩展名：`import x from './x.js'`（即使源文件 `.ts`）
- 任何代码修改（新增/更新/重构）必须同步更新对应测试用例

## 常见坑（高频错误）

- 手动编辑自动生成文件（构建会覆盖）
- 使用命名导出（不会聚合到 index.ts）
- 相对导入忘 `.js` 扩展名（ESLint 报错）
- 数组索引不检查 `undefined`（因 `noUncheckedIndexedAccess` 启用）
- 修改代码忘更新测试（强制要求）
- 测试假定并行（实际串行）
- echo 输出用绝对路径（应让 echo 简化）
- 测试第三方库/原生功能而非项目封装

## 开发流程

### 核心命令

`pnpm install` 安装 · `pnpm test` 串行测试 · `pnpm build` 构建（测试 → 重写配置 → 打包）· `pnpm lint` 规范修复 · `pnpm task [name]` 任务运行器

### 新增工具流程

创建 `src/<name>.ts`（仅默认导出）→ 添加 `test/<name>.test.ts` → 执行 `pnpm build`（自动重写配置）→ 确认 exports 并通过测试

### 测试规范

**应该测试**：业务逻辑（backup 生成 `.bak`、copy 自动 `.copy`）· 参数验证 · 错误处理 · 项目特有功能（`ListSource` 类型、echo 路径简化）· 跨平台兼容

**不应该测试**：第三方库基本功能 · JS 原生类型系统 · 操作系统命令输出 · 时间精度

**测试结构**：`src/backup.ts` → `test/backup.test.ts` · Vitest `fileParallelism: false`（串行）· 临时文件 `temp/<模块名>/` + `beforeEach`/`afterEach` 清理 · 路径别名 `@/*` 仅测试用，`src/` 内部用相对路径 + `.js`

## 架构细节（按需查阅）

### 模块结构

- **类型导入**：`import type { T }` · 优先 `type` 而非 `interface`
- **数组访问安全**：启用 `noUncheckedIndexedAccess`，数组访问返回 `T | undefined`，必须检查：`const first = arr.at(0); if (!first) return`
- **品牌类型**：`glob()` 返回 `ListSource`（带 `__IS_LISTED_AS_SOURCE__` 品牌）用于缓存重用

### 日志与输出

- **统一输出**：`echo(tag, message)` 或 `echo(message)`
- **路径简化**：项目根 → `.` · 用户主目录 → `~`
- **静默控制**：`echo.freeze(promise)` 异步静默 · `echo.whisper(callback)` 临时静默 · `echo.pause()`/`echo.resume()` 手动控制
- **无匹配处理**：`echo('模块名', 'no files found matching ...')` + 早返回（禁止抛异常）

### 标准文件操作模板

```typescript
const myFunction = async (source: string | string[], { concurrency = 5 }: Options = {}) => {
  const listSource = await glob(source)
  if (!listSource.length) { echo('myfunction', `no files found matching ${wrapList(source)}`); return }
  await runConcurrent(concurrency, listSource.map(src => async () => { /* 处理 */ }))
  echo('myfunction', `processed ${wrapList(source)}`)
}
```

## 参考配置

### 任务系统

入口 `tasks/index.ts` 动态发现 · 命名 `subdir@file` → 执行重排 `file/subdir` · 构建流程：测试失败退出 → 重写配置 → 打包

### ESLint 规则

禁用 `public` 关键字 · 强制 `import type` · 优先 `type` 而非 `interface` · 相对导入需 `.js` · 导入排序（builtin → external → internal → parent → sibling → index → type）· 自动移除未使用导入 · Prettier 集成（无分号、单引号、尾随逗号）
