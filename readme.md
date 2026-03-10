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
import backup from "fire-keeper/backup";
await backup("./data.txt"); // 创建 data.txt.bak

// 或导入所有功能
import * as fk from "fire-keeper";
await fk.copy("./src", "./dist"); // 复制整个目录到 ./dist/src
await fk.remove("./temp"); // 删除文件夹
```

## LLM Friendly Summary | LLM 友好摘要

**EN:** Fire Keeper is a pure ESM Node.js/TypeScript filesystem automation toolkit for backup, copy, remove, glob, watch, and concurrent workflows.
**ZH:** Fire Keeper 是一个纯 ESM 的 Node.js/TypeScript 文件系统自动化工具库，提供备份、复制、删除、匹配、监听与并发执行能力。

### Quickstart | 快速开始

```bash
pnpm i fire-keeper
node --input-type=module -e "import backup from 'fire-keeper/backup'; await backup('./config.json')"
```

### Key Capabilities | 核心能力

- EN: file backup/copy/remove; path matching/normalization; concurrent task execution
- ZH: 文件备份复制删除；路径匹配与规范化；并发任务执行

### Typical Use Cases | 典型场景

- EN: automate build/deploy file pipelines
- ZH: 自动化构建与部署文件流程

### Keywords | 关键词

- EN: nodejs, typescript, filesystem, file-operations, automation, esm, cli, glob, file-watcher, concurrency
- ZH: Node.js, TypeScript, 文件系统, 文件操作, 自动化, ESM, 命令行, glob, 文件监听, 并发

### Docs & API | 文档与 API

- Docs: https://github.com/phonowell/fire-keeper/blob/main/usage.md
- API: https://github.com/phonowell/fire-keeper/blob/main/readme.md
- Examples: https://github.com/phonowell/fire-keeper/blob/main/readme.md

## 核心功能 | Core Features

### 文件操作 | File Operations

#### backup
创建文件备份

```typescript
import backup from "fire-keeper/backup";

// 备份单个文件
await backup("./config.json"); // 创建 config.json.bak

// 备份多个文件
await backup(["./file1.txt", "./file2.txt"]);

// 使用通配符
await backup("./src/**/*.ts");

// 自定义并发数
await backup("./data/*.json", { concurrency: 3 });
```

#### copy
复制文件或文件夹

```typescript
import copy from "fire-keeper/copy";

// 复制单个文件
await copy("./src/file.txt", "./dist/");

// 复制多个文件
await copy(["./file1.txt", "./file2.txt"], "./dist/");

// 使用通配符
await copy("./src/**/*.ts", "./dist/");
```

#### remove
删除文件或文件夹

```typescript
import remove from "fire-keeper/remove";

// 删除单个文件
await remove("./temp/file.txt");

// 删除多个文件
await remove(["./file1.txt", "./file2.txt"]);

// 使用通配符
await remove("./logs/*.log");

// 删除文件夹
await remove("./temp/");
```

#### recover
从备份文件恢复

```typescript
import recover from "fire-keeper/recover";

// 从备份恢复文件
await recover("./config.json"); // 使用 config.json.bak 恢复
```

#### zip
创建 ZIP 压缩文件

```typescript
import zip from "fire-keeper/zip";

// 压缩单个文件
await zip("./file.txt", "./archive/");

// 压缩多个文件
await zip(["./file1.txt", "./file2.txt"], "./archive/");

// 使用通配符
await zip("./src/**/*.ts", "./archive/src.zip");
```

### 路径处理 | Path Handling

#### glob
匹配文件路径

```typescript
import glob from "fire-keeper/glob";

// 匹配文件
const files = await glob("./src/**/*.ts");

// 只匹配文件
const onlyFiles = await glob("./src/**/*", { onlyFiles: true });

// 只匹配文件夹
const onlyDirs = await glob("./src/**/*", { onlyDirectories: true });
```

#### normalizePath
规范化路径

```typescript
import normalizePath from "fire-keeper/normalizePath";

const normalized = normalizePath("./src/../dist/file.txt");
// 输出: /abs/path/to/project/dist/file.txt
```

### 并发执行 | Concurrent Execution

#### runConcurrent
并发执行任务

```typescript
import runConcurrent from "fire-keeper/runConcurrent";

const tasks = [
  () => Promise.resolve(1),
  () => Promise.resolve(2),
  () => Promise.resolve(3)
];

const results = await runConcurrent(2, tasks); // 最大并发数为 2
```

### 命令行工具 | CLI Tools

#### argv
解析命令行参数

```typescript
import argv from "fire-keeper/argv";

const args = await argv();
console.log(args.name); // --name value
console.log(args._);    // 位置参数
```

### 文件监听 | File Watching

#### watch
监听文件变化

```typescript
import glob from "fire-keeper/glob";
import watch from "fire-keeper/watch";

// 监听单个文件
const unwatch = watch("./file.txt", (path) => {
  console.log(`${path} 已更改`);
});

// 监听多个文件
watch(["./file1.txt", "./file2.txt"], (path) => {
  console.log(`${path} 已更改`);
});

// 监听匹配到的文件（chokidar v4+ 不支持直接传 glob）
const files = await glob("./src/**/*.ts");
watch(files, (path) => {
  console.log(`${path} 已更改`);
});

// 带防抖选项
watch("./file.txt", (path) => {
  console.log(`${path} 已更改`);
}, { debounce: 300 });

// 停止监听
unwatch();
```

### 实用工具 | Utilities

#### findIndex
查找数组中符合条件的元素索引

```typescript
import findIndex from "fire-keeper/findIndex";

const arr = [1, 2, 3, 4, 5];
const index = findIndex(arr, (x) => x > 3);
// 输出: 3
```

#### toArray
确保值为数组

```typescript
import toArray from "fire-keeper/toArray";

const arr1 = toArray(1); // [1]
const arr2 = toArray([1, 2]); // [1, 2]
const arr3 = toArray(undefined); // []
```

## 开发指南 | Development

### 项目结构 | Project Structure

```
fire-keeper/
├── src/          # 源代码
├── dist/         # 构建输出（自动生成）
├── test/         # 测试文件
├── tasks/        # 构建任务
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
