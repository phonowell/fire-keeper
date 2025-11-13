# Fire Keeper – AI 编码助手说明

本文档总结本项目特有的工程模式，帮助 AI 代理快速、高质量地做出符合现有风格的修改。请保持改动聚焦与一致性。

## 概览

- 目标：Node.js / TypeScript 小型工具集，按功能拆分为多个独立的文件系统与通用辅助函数（如 `backup`、`copy`、`remove`、`glob` 等）。
- 结构：`src/` 下每个文件仅默认导出一个函数；`task/` 为维护与构建脚本；`test/` 与 `src/` 一一对应的测试文件。
- 发布：构建产物为纯 ESM，生成到 `dist/`；`package.json` 中显式列出每个子模块的 `exports`。

## 核心工作流

- 安装依赖：`pnpm install`
- 运行测试（串行）：`pnpm test`
- 任务交互/直跑：`pnpm task` 或 `pnpm task build` / `pnpm task update`
- 构建发布：`pnpm build`（先跑测试 → 重写 `src/index.ts` / rollup 输入 → 打包 → 生成声明）。
- 代码规范与自动修复：`pnpm lint`

## 模块约定

- 每个工具文件只默认导出单函数：如 `backup.ts` → `export default backup`；不要使用命名导出，聚合在自生成的 `src/index.ts` 中完成。
- 日志：使用 `echo(tag, message)` 或 `echo(message)`；建议在完成与无匹配场景使用 `echo('<模块名>', '...')`。
- 文件匹配统一用 `glob()`，参数可为字符串或数组，需要时传 `{ onlyFiles: true/false }`。
- 并发：带并发选项的函数使用 `runConcurrent(limit, tasks[])`，选项命名保持 `{ concurrency = 5 }`。
- 无匹配：统一输出 `echo('<模块>', 'no files found matching ...')`，借助 `wrapList(source)` 生成友好列表。

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

- 项目为 ESM (`"type": "module"`)，要求 Node >= 24。
- Vitest 设置 `fileParallelism: false` → 测试串行；避免设计依赖文件并行。
- 仅测试/构建环境使用别名 `'@': '/src'`；在 `src/` 内部保持相对路径导入。

## 日志与错误

- 对“无匹配”场景使用统一早返回 + `echo('<module>', 'no files found matching ...')`，不抛异常。
- 任务层面严重失败可使用 `console.error`；库函数保持轻量、纯输出。

## 安全修改指引

- 不直接修改 `dist/`。
- 保持函数签名稳定；新增可选项时使用解构默认值：`({ concurrency = 5 }: Options = {})`。
- 优先复用现有工具：`glob`、`wrapList`、`runConcurrent`、`echo`；谨慎新增依赖。

## 示例

- 备份：`await backup(['*.ts'], { concurrency: 3 })` → 生成 `.bak` 副本。
- 删除：`await remove(['temp/**','logs/*.log'])` → 模式匹配删除文件与目录。

## 常见坑

- 手动编辑 `src/index.ts` 或 `rollup.config.js` 的输入块（构建会覆盖）。
- 忘记默认导出（命名导出不会被聚合）。
- 测试编写假定并行导致状态污染。

## 不确定时

- 查找相似模块：并发删除参考 `remove.ts`，文件名变换参考 `backup.ts`。
- 若需新增模式与现有明显不同，请在本文件中补充一小段说明。

---

反馈欢迎：是否还需补充发布流程、版本策略、日志格式或错误处理细节？
