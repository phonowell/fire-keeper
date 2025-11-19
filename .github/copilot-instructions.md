# Fire Keeper – AI 编码助手说明

> **元原则**：中文文档 · 300行限制 · AI友好优先 · 节省Tokens · 并行工具调用 · 代码优先于文档 · **人工要求的信息不可轻易移除**

本文档总结本项目特有的工程模式，帮助 AI 代理快速、高质量地做出符合现有风格的修改。请保持改动聚焦与一致性。

## 概览

- **目标**：Node.js / TypeScript 轻量工具库，提供 40+ 文件系统与通用辅助函数（`backup`、`copy`、`remove`、`glob`、`echo`、`prompt` 等），支持模块化按需导入。
- **结构**：`src/` 下每个文件仅默认导出一个函数；`task/` 为维护与构建脚本；`test/` 与 `src/` 一一对应的测试文件。
- **发布**：纯 ESM 模块（`"type": "module"`），构建至 `dist/`；`package.json` 显式列出所有子模块的 `exports`；要求 Node.js ≥ 24。

## 核心工作流

- 安装依赖：`pnpm install`
- 运行测试（串行）：`pnpm test`
- 任务交互/直跑：`pnpm task` 或 `pnpm task build` / `pnpm task update`
- 构建发布：`pnpm build`（先跑测试 → 重写 `src/index.ts` / rollup 输入 → 打包 → 生成声明）。
- 代码规范与自动修复：`pnpm lint`

## 模块约定

- **默认导出**：每个工具文件只默认导出单函数：如 `backup.ts` → `export default backup`；不使用命名导出，聚合由自生成的 `src/index.ts` 统一完成。
- **导入扩展名**：所有相对导入必须包含 `.js` 扩展名（即使源文件是 `.ts`）：`import echo from './echo.js'` ✅；`import echo from './echo'` ❌。
- **日志输出**：使用 `echo(tag, message)` 或 `echo(message)`；建议格式 `echo('<模块名>', '完成描述')`；路径自动简化为 `.`（项目根）或 `~`（用户主目录）。
- **静默操作**：检查文件等不需要输出的操作使用 `echo.freeze(promise)` 或 `echo.whisper(callback)`；长期静默用 `echo.pause()` / `echo.resume()`。
- **文件匹配**：统一用 `glob(pattern, options?)`，参数可为字符串或数组；返回带品牌类型的 `ListSource`（可重复传入以跳过重复查询）；常用选项 `{ onlyFiles: true }`。
- **并发控制**：并发函数使用 `runConcurrent(limit, tasks[])`，选项命名保持 `{ concurrency = 5 }`。
- **无匹配处理**：统一输出 `echo('<模块>', 'no files found matching ...')`，借助 `wrapList(source)` 生成友好的引号列表格式。

## 新增工具流程

1. 创建 `src/<name>.ts`，仅一个默认导出的函数；必要时定义 `type Options`，写最小 JSDoc 示例。
2. 添加对应测试 `test/<name>.test.ts`；测试假定串行执行，避免并行共享状态。
3. 执行 `pnpm build`，自动重写 `src/index.ts`、`package.json exports`、`rollup.config.js` 输入，不要手动改这些生成段。
4. 确认新模块已出现在 `package.json` 的 `exports` 中并通过测试。

## 任务系统（`task/`）

- 入口：`task/index.ts` 使用 `glob(['./task/**/*.js','./task/**/*.ts'])` 动态发现任务 + 交互选择（内部 `prompt()` 包装）。
- 命名：文件夹与文件组合为 `subdir@file`，在执行时重排为 `file/subdir`（见 `executeTask` 中 `a@b` → `b/a` 逻辑）；排除 `index`。
- 任务实现：默认异步函数导出（如 `task/build.ts` → `export default main`）。

## 构建脚本（`task/build.ts`）

- 构建前强制跑测试，失败直接退出（`console.error` 提示）。
- 动态收集 `src/*.ts`（排除 `index.ts`）生成新的 `src/index.ts`。
- 重写 `package.json.exports` 与 `rollup.config.js` 的 `input`（勿直接编辑生成后的结果，需改则修改此脚本）。
- 最后调用 `rollup` + `tsc` 生成打包与声明。

## 类型与配置

- **TypeScript 严格模式**：启用 `noUncheckedIndexedAccess`（数组访问返回 `T | undefined`，需显式检查）、`noImplicitAny`、`strictNullChecks` 等全部严格选项。
- **ESM 模块**：`"type": "module"`，要求 Node.js ≥ 24；`moduleResolution: "bundler"`；所有相对导入需 `.js` 后缀。
- **类型导入**：优先使用 `import type { T } from '...'`（ESLint 强制）；优先使用 `type` 而非 `interface`。
- **测试配置**：Vitest 设置 `fileParallelism: false` → 测试串行执行；避免设计依赖文件并行，测试临时文件统一在 `temp/<模块名>/` 下。
- **路径别名**：仅测试/构建环境使用别名 `'@': '/src'`；在 `src/` 内部必须使用相对路径 + `.js` 扩展名导入。

## 日志与错误

- 对“无匹配”场景使用统一早返回 + `echo('<module>', 'no files found matching ...')`，不抛异常。
- 任务层面严重失败可使用 `console.error`；库函数保持轻量、纯输出。

## 安全修改指引

- **禁止手动编辑**：`dist/`、`src/index.ts`、`package.json` 的 `exports` 字段、`rollup.config.js` 的 `input` 对象均为构建自动生成，直接修改会被覆盖。
- **保持签名稳定**：新增可选项时使用解构默认值：`({ concurrency = 5 }: Options = {})`。
- **优先复用工具**：`glob`、`wrapList`、`runConcurrent`、`echo`、`normalizePath`、`toArray` 等；谨慎新增依赖。
- **类型安全**：因启用 `noUncheckedIndexedAccess`，数组索引访问需检查：`const first = arr.at(0); if (!first) return`。

## 工具分类速查

### 文件操作

`backup` `clean` `copy` `download` `move` `read` `recover` `remove` `rename` `write` `zip` `isExist` `isSame` `stat` `watch`

### 路径处理

`getBasename` `getDirname` `getExtname` `getFilename` `getName` `normalizePath` `home` `root` `glob` `mkdir`

### 系统与执行

`os` `exec` `run` `runConcurrent` `sleep`

### 命令行交互

`argv` `echo` `prompt`

### 数组与数据

`at` `findIndex` `flatten` `toArray` `toDate` `trimEnd` `wrapList`

## 常用模式示例

```typescript
// 典型文件操作模块结构
import echo from "./echo.js";
import glob from "./glob.js";
import wrapList from "./wrapList.js";
import runConcurrent from "./runConcurrent.js";

type Options = { concurrency?: number };

const myFunction = async (
  source: string | string[],
  { concurrency = 5 }: Options = {}
) => {
  const listSource = await glob(source);

  if (!listSource.length) {
    echo("myfunction", `no files found matching ${wrapList(source)}`);
    return;
  }

  await runConcurrent(
    concurrency,
    listSource.map((src) => async () => {
      // 处理每个文件
      const result = await processFile(src);
      return result;
    })
  );

  echo("myfunction", `processed ${wrapList(source)}`);
};

export default myFunction;
```

## 常见坑

- 手动编辑 `src/index.ts`、`package.json.exports` 或 `rollup.config.js` 的自动生成部分（构建会覆盖）。
- 忘记默认导出（命名导出不会被聚合到 `index.ts`）。
- 相对导入忘记 `.js` 扩展名（ESLint 会报错）。
- 数组索引访问不检查 `undefined`（因 `noUncheckedIndexedAccess` 启用）。
- 测试编写假定并行导致状态污染（Vitest 配置为串行执行）。
- 在 `echo` 输出中使用绝对路径（应该让 `echo` 自动简化为 `.` 或 `~`）。

## ESLint 规则要点

- 禁用 `public` 关键字（类成员默认 public）。
- 强制 `import type` 语法用于类型导入。
- 优先使用 `type` 而非 `interface`。
- 要求相对导入包含 `.js` 扩展名。
- 导入排序：builtin → external → internal → parent → sibling → index → type。
- 自动移除未使用的导入（`unused-imports` 插件）。
- Prettier 集成：无分号、单引号、尾随逗号。

## 依赖管理

- 生产依赖：`archiver`、`chokidar`、`fast-glob`、`fs-extra`、`js-yaml`、`kleur`、`prompts`、`radash`、`yargs`。
- 开发依赖：`rollup`、`typescript`、`vitest`、`eslint`、`prettier`、`tsx`。
- 更新流程：`pnpm task update`（自动更新非锁定的依赖至 `@latest`，跳过 React 相关包）。

## 不确定时

- **查找相似模块**：并发删除参考 `remove.ts`；文件名变换参考 `backup.ts`；路径解析参考 `getName.ts` 家族；静默操作参考 `isSame.ts`、`isExist.ts`。
- **复用核心工具**：`glob` 返回 `ListSource` 品牌类型可缓存；`echo.freeze()` 用于完全静默；`echo.whisper()` 用于临时静默；`wrapList()` 格式化列表输出。
- 若需新增模式与现有明显不同，请在本文件中补充一小段说明。

---

**文档最后更新**：项目当前提供 40 个工具模块（见 `package.json.exports`），覆盖文件操作、路径处理、系统执行、CLI 交互、数据处理五大类。
