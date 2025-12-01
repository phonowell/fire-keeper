# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供在此仓库中工作的指导。

## 项目概览

Fire Keeper 是一个 Node.js/TypeScript 轻量工具库，提供 40+ 文件系统与通用辅助函数（backup、copy、remove、glob、echo、prompt 等），支持模块化按需导入。发布为纯 ESM 模块，要求 Node.js ≥ 24。

## 核心命令

```bash
# 安装依赖
pnpm install

# 运行所有测试（串行执行）
pnpm test

# 构建（测试 → 重写 index/exports → rollup → 声明）
pnpm build

# 代码规范与自动修复
pnpm lint

# 交互式任务运行器
pnpm task

# 运行特定任务
pnpm task build
pnpm task update
```

## 架构与核心模式

### 模块结构

- `src/` 中每个文件**仅默认导出一个函数**（禁止命名导出）
- `src/index.ts`、`package.json` 的 exports 字段、`rollup.config.js` 的 input 对象均为**自动生成**（由 `task/build.ts` 生成），禁止手动编辑
- 所有相对导入必须包含 `.js` 扩展名（即使源文件是 `.ts`）：`import echo from './echo.js'` ✅

### 类型系统与品牌类型

- **TypeScript 严格模式**：启用 `noUncheckedIndexedAccess` - 数组访问返回 `T | undefined`，必须显式检查
- **品牌类型**：`glob()` 返回 `ListSource`（带 `__IS_LISTED_AS_SOURCE__` 品牌的 string 数组），用于缓存与重用
- 优先使用 `type` 而非 `interface`，类型导入使用 `import type`

### 日志与输出

- 统一使用 `echo(tag, message)` 或 `echo(message)` 输出
- 路径自动简化：项目根目录 → `.`，用户主目录 → `~`
- 静默操作：
  - `echo.freeze(promise)` - 异步操作期间完全静默
  - `echo.whisper(callback)` - 临时静默，自动恢复
  - `echo.pause()` / `echo.resume()` - 手动控制
- 无匹配场景：`echo('模块名', 'no files found matching ...')` + 早返回（禁止抛异常）

### 文件操作模式

```typescript
import echo from './echo.js'
import glob from './glob.js'
import wrapList from './wrapList.js'
import runConcurrent from './runConcurrent.js'

type Options = { concurrency?: number }

const myFunction = async (
  source: string | string[],
  { concurrency = 5 }: Options = {}
) => {
  const listSource = await glob(source)

  if (!listSource.length) {
    echo('myfunction', `no files found matching ${wrapList(source)}`)
    return
  }

  await runConcurrent(
    concurrency,
    listSource.map(src => async () => {
      // 处理每个文件
    })
  )

  echo('myfunction', `processed ${wrapList(source)}`)
}

export default myFunction
```

### 任务系统

- 入口：`task/index.ts` 通过 `glob(['./task/**/*.js', './task/**/*.ts'])` 动态发现任务
- 命名规则：`subdir@file` → 执行时重排为 `file/subdir`
- 每个任务默认导出异步函数
- 构建任务（`task/build.ts`）：先跑测试（失败直接退出）→ 重写 index/exports/rollup 配置 → 打包

## 测试规范

**强制要求**：任何代码修改（新增、更新、重构）都必须同步检查并更新对应测试用例。

### 应该测试的内容

✅ 项目业务逻辑（backup 生成 `.bak` 文件、copy 自动生成 `.copy` 后缀）
✅ 输入参数验证（空字符串抛异常、数组参数支持）
✅ 错误处理逻辑（文件不存在时的行为、权限错误处理）
✅ 项目特有功能（glob 返回的 `ListSource` 类型、echo 的路径简化）
✅ 跨平台兼容性（Windows 路径转换、`~/` 前缀处理）

### 不应该测试的内容

❌ 第三方库的基本功能（yargs、fast-glob、fs-extra、path 的内部行为）
❌ JavaScript 原生类型系统（Symbol、BigInt、Date 解析、正则表达式）
❌ 操作系统命令的输出（如 exec 测试 ls/pwd 命令的结果）
❌ 时间精度（如 sleep 测试精确的延迟毫秒数）

### 测试结构

- 测试与源码一一对应：`src/backup.ts` → `test/backup.test.ts`
- Vitest 配置 `fileParallelism: false`（串行执行）
- 临时文件放在 `temp/<模块名>/`，使用 `beforeEach`/`afterEach` 清理
- 路径别名 `@/*` 仅用于测试；`src/` 内部必须使用相对路径 + `.js` 扩展名

## 新增工具流程

1. 创建 `src/<name>.ts`，仅一个默认导出的函数
2. 添加对应测试 `test/<name>.test.ts`
3. 执行 `pnpm build` - 自动重写 `src/index.ts`、`package.json` 的 exports、rollup 输入
4. 确认新模块已出现在 exports 中并通过测试

## 关键规则

### 自动生成的文件（禁止手动编辑）

- `dist/`
- `src/index.ts`
- `package.json` 的 exports 字段
- `rollup.config.js` 的 input 对象

### 模块约定

- 仅默认导出：`export default myFunction`
- 导入扩展名必需：`import x from './x.js'`（不能是 `'./x'`）
- 类型导入：`import type { T } from '...'`
- 数组访问安全：`const first = arr.at(0); if (!first) return`

### 常见坑

- 手动编辑自动生成的文件（构建会覆盖）
- 使用命名导出（不会被聚合到 index.ts）
- 相对导入忘记 `.js` 扩展名（ESLint 会报错）
- 数组索引访问不检查 `undefined`（因 `noUncheckedIndexedAccess` 启用）
- 测试假定并行执行（实际为串行）
- echo 输出中使用绝对路径（应让 echo 自动简化）
- **修改代码后忘记更新测试**（强制要求）
- 测试第三方库功能而非项目封装
- 测试 JavaScript 原生行为而非业务逻辑

## ESLint 关键规则

- 禁用 `public` 关键字（类成员默认 public）
- 强制 `import type` 语法用于类型导入
- 优先使用 `type` 而非 `interface`
- 要求相对导入包含 `.js` 扩展名
- 导入排序：builtin → external → internal → parent → sibling → index → type
- 自动移除未使用的导入（`unused-imports` 插件）
- Prettier 集成：无分号、单引号、尾随逗号

## 工具分类

**文件操作**：backup、clean、copy、download、move、read、recover、remove、rename、write、zip、isExist、isSame、stat、watch

**路径处理**：getBasename、getDirname、getExtname、getFilename、getName、normalizePath、home、root、glob、mkdir

**系统与执行**：os、exec、run、runConcurrent、sleep

**命令行交互**：argv、echo、prompt

**数组与数据**：at、findIndex、flatten、toArray、toDate、trimEnd、wrapList

## 并发控制

- 并发函数使用 `runConcurrent(limit, tasks[])`
- 选项命名保持 `{ concurrency = 5 }`

## 安全修改指引

- **禁止手动编辑自动生成部分**：`dist/`、`src/index.ts`、`package.json` 的 exports、`rollup.config.js` 的 input（构建会覆盖）
- **保持签名稳定**：新增可选项使用解构默认值：`({ concurrency = 5 }: Options = {})`
- **优先复用工具**：`glob`、`wrapList`、`runConcurrent`、`echo`、`normalizePath`、`toArray` 等；谨慎新增依赖
- **类型安全**：因 `noUncheckedIndexedAccess` 启用，数组索引访问需检查：`const first = arr.at(0); if (!first) return`

## 依赖管理

- 生产依赖：archiver、chokidar、fast-glob、fs-extra、js-yaml、kleur、prompts、radash、yargs
- 开发依赖：rollup、typescript、vitest、eslint、prettier、tsx
- 更新流程：`pnpm task update`（自动更新非锁定的依赖至 @latest）
