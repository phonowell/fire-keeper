# Fire Keeper

一个专注于自动化工作的 Node.js/TypeScript 工具箱。
A Node.js/TypeScript toolkit focused on automation tasks.

## 特点 | Features

- 📦 纯 ESM 模块设计
- 🚀 支持 Node.js ≥24
- 🔧 丰富的文件操作工具
- ⚡ 高效的并发执行
- 📋 强大的命令行工具
- 👁️ 实时文件监听
- ✅ 完整的 TypeScript 类型支持
- 🧪 基于 TDD 的开发流程

## 安装 | Installation

使用你喜欢的包管理器安装：

```shell
# pnpm
pnpm i fire-keeper

# npm
npm i fire-keeper

# yarn
yarn add fire-keeper
```

## 快速开始 | Quick Start

```typescript
// 导入单个功能
import backup from 'fire-keeper/backup'
await backup('./data.txt') // 创建 data.txt.bak

// 或导入所有功能
import * as fk from 'fire-keeper'
await fk.copy('./src', './dist') // 复制整个目录到 ./dist/src
await fk.remove('./temp') // 删除文件夹
```

## 功能索引 | Function Index

完整签名与示例见各模块 JSDoc；npm 包内含自动生成的 `dist/api.md`（全部 40 个导出）。

| 分类 | 函数                                                            | 说明                                            |
| ---- | --------------------------------------------------------------- | ----------------------------------------------- |
| 文件 | `backup`                                                        | 创建 `.bak` 备份                                |
| 文件 | `clean`                                                         | 删除文件并清理空父目录                          |
| 文件 | `copy`                                                          | 复制文件/目录，支持 glob 与改名                 |
| 文件 | `download`                                                      | 下载文件到目录                                  |
| 文件 | `isExist`                                                       | 检查路径是否存在                                |
| 文件 | `isSame`                                                        | 比较多文件内容是否一致                          |
| 文件 | `mkdir`                                                         | 递归创建目录                                    |
| 文件 | `move`                                                          | 移动（copy + remove）                           |
| 文件 | `read`                                                          | 按扩展名智能读取解析                            |
| 文件 | `recover`                                                       | 从 `.bak` 恢复                                  |
| 文件 | `remove`                                                        | 删除文件/目录/通配符                            |
| 文件 | `rename`                                                        | 重命名（仅 basename）                           |
| 文件 | `stat`                                                          | 获取文件状态，无匹配返回 `null`                 |
| 文件 | `write`                                                         | 写入，自动建目录与类型处理                      |
| 文件 | `zip`                                                           | 创建 ZIP 压缩包                                 |
| 路径 | `getBasename` `getDirname` `getExtname` `getFilename` `getName` | 路径组件解析                                    |
| 路径 | `glob`                                                          | 文件匹配，返回可复用 `ListSource`               |
| 路径 | `home` `root`                                                   | 主目录 / 当前工作目录（正斜杠）                 |
| 路径 | `normalizePath`                                                 | 规范化路径（`~` `.` `..` `!`）                  |
| 执行 | `exec`                                                          | 跨平台命令执行（sh / PowerShell）               |
| 执行 | `run`                                                           | 立即执行函数                                    |
| 执行 | `runConcurrent`                                                 | 并发任务控制                                    |
| 执行 | `sleep`                                                         | 延时                                            |
| CLI  | `argv`                                                          | 命令行参数解析                                  |
| CLI  | `echo`                                                          | 格式化日志（含 `freeze/whisper/pause/resume`）  |
| CLI  | `prompt`                                                        | 交互式提示（支持缓存）                          |
| CLI  | `wrapList`                                                      | 列表格式化输出                                  |
| 监听 | `watch`                                                         | 文件变更监听（防抖，仅 `change`）               |
| 工具 | `at`                                                            | 安全取值（数组/嵌套对象）                       |
| 工具 | `findIndex` `flatten` `toArray` `toDate` `trimEnd`              | 数组/字符串工具                                 |
| 工具 | `os`                                                            | 系统识别（`macos`/`windows`/`linux`/`unknown`） |

通用约定：文件类 API 的 `source` 均支持 `string | string[]` 与 glob；`options.echo: false` 可静默日志；无匹配时回显并早返回。

## 常用示例 | Examples

```typescript
import { backup, copy, remove, zip } from 'fire-keeper'

await remove('./dist')
await copy('./src', './dist')
await zip('./dist/**/*', './build/output.zip')
await backup('./config.json', { concurrency: 3 })
```

```typescript
import { glob, runConcurrent, watch } from 'fire-keeper'

const files = await glob('./src/**/*.ts')
await runConcurrent(
  5,
  files.map((f) => () => process(f)),
)

const unwatch = watch(files, (path) => console.log('changed:', path), { debounce: 300 })
unwatch()
```

## 开发指南 | Development

### 项目结构 | Project Structure

```
fire-keeper/
├── src/          # 源代码（JSDoc 即 API 文档源）
├── dist/         # 构建输出（自动生成，含 api.md）
├── test/         # 测试文件
├── tasks/        # 构建任务
├── plans/        # 任务计划
└── package.json
```

### 开发命令 | Development Commands

```shell
# 运行测试
pnpm test

# 构建项目
pnpm build

# 代码 lint
pnpm lint

# 运行自定义任务
pnpm task [name]
```

### 核心约束 | Core Constraints

- 仅使用默认导出（`export default fn`）
- 相对导入必须带 `.js` 扩展名
- 代码修改必须同步更新测试
- 遵循 TDD 开发流程

## 许可证 | License

[MIT License](./license.md)

## 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！

## 作者 | Author

- [Mimiko Phonowell](https://github.com/phonowell)

## 链接 | Links

- [GitHub 仓库](https://github.com/phonowell/fire-keeper)
- [NPM 包](https://www.npmjs.com/package/fire-keeper)
