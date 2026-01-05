# Fire Keeper Usage

Node.js/TS 文件系统工具库 · 纯 ESM · Node ≥24

```typescript
import backup from "fire-keeper/backup.js";
import * as fk from "fire-keeper"; // 或导入全部
```

## 功能索引

| 模块类型 | 功能名称 | 描述 |
|---------|---------|------|
| 文件操作 | backup | 创建文件备份 |
| 文件操作 | copy | 复制文件/文件夹 |
| 文件操作 | remove | 删除文件/文件夹 |
| 文件操作 | recover | 从备份恢复文件 |
| 文件操作 | zip | 创建 ZIP 压缩文件 |
| 路径处理 | glob | 匹配文件路径 |
| 路径处理 | normalizePath | 规范化路径 |
| 并发执行 | runConcurrent | 并发执行任务 |
| 命令行工具 | argv | 解析命令行参数 |
| 文件监听 | watch | 监听文件变化 |
| 实用工具 | findIndex | 查找数组元素索引 |
| 实用工具 | toArray | 确保值为数组 |

## API

### 文件操作

**backup**(source, { concurrency = 5 }): 创建 `.bak` 备份
```typescript
await backup("./config.json");
await backup("./src/**/*.ts", { concurrency: 3 });
```

**copy**(source, target, { concurrency, filename }): 复制文件/目录
```typescript
await copy("./src/file.txt", "./dist/");
await copy(["./file1.txt", "./file2.txt"], "./dist/");
```

**remove**(source, { concurrency }): 删除文件/目录
```typescript
await remove("./temp/file.txt");
await remove("./logs/*.log");
```

**recover**(source): 从 `.bak` 恢复
```typescript
await recover("./config.json");
```

**zip**(source, target, { base, filename }): 创建 ZIP
```typescript
await zip("./src/**/*.ts", "./archive/src.zip");
```

### 路径处理

**glob**(pattern, { onlyFiles, onlyDirs }): 匹配文件路径
```typescript
const files = await glob("./src/**/*.ts");
const onlyFiles = await glob("./src/**/*", { onlyFiles: true });
```

**normalizePath**(path): 规范化路径
```typescript
normalizePath("./src/../dist/file.txt"); // => ./dist/file.txt
```

### 并发执行

**runConcurrent**(concurrency, tasks): 控制并发任务
```typescript
const results = await runConcurrent(2, [
  () => Promise.resolve(1),
  () => Promise.resolve(2)
]);
```

### 命令行

**argv**(): 解析参数
```typescript
const args = await argv();
console.log(args.name); // --name value
console.log(args._);    // 位置参数
```

### 文件监听

**watch**(source, callback, { debounce }): 监听变化，返回 unwatch 函数
```typescript
const unwatch = watch("./file.txt", (path) => {
  console.log(`${path} 已更改`);
}, { debounce: 300 });

unwatch(); // 停止监听
```

### 工具

**findIndex**(arr, predicate): 查找索引
```typescript
findIndex([1, 2, 3, 4], x => x > 3); // => 3
```

**toArray**(value): 转数组
```typescript
toArray(1);         // => [1]
toArray([1, 2]);    // => [1, 2]
toArray(undefined); // => []
```

## 使用示例

**构建工作流**
```typescript
import { remove, copy, zip } from "fire-keeper";

await remove("./dist");
await copy("./src", "./dist");
await zip("./dist/**/*", "./build/output.zip");
```

**监听自动备份**
```typescript
import watch from "fire-keeper/watch.js";
import backup from "fire-keeper/backup.js";

watch("./src/**/*.ts", async (path) => {
  await backup(path);
});
```

## 开发

**项目约束**（详见 [CLAUDE.md](CLAUDE.md)）
- 仅默认导出 · 导入需 `.js` · 改代码必改测试 · TDD 模式

**命令**
```bash
pnpm test  # 测试
pnpm build # 构建
pnpm lint  # 检查
```

**链接**
- [GitHub](https://github.com/phonowell/fire-keeper)
- [NPM](https://www.npmjs.com/package/fire-keeper)
- [README](https://github.com/phonowell/fire-keeper/blob/main/README.md)