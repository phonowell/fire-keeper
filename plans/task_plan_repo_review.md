# 仓库修复计划

- [completed] 复核范围：实现缺陷、测试缺口、文档契约与坏味道
- [completed] 修复 `src/recover.ts` 后缀恢复错误并补测试
- [completed] 修复 `src/exec.ts` 命令链失败语义与平台注释并补测试
- [completed] 修复 `src/exec.ts` 数组命令拆分多 shell 导致上下文丢失回归并补测试
- [completed] 修复 `src/download.ts` 参数校验与伪 streaming 坏味道并补测试
- [completed] 修正文档导入路径、`watch`/`normalizePath` 示例与行为描述
- [completed] 串行执行 `pnpm lint`、`pnpm test`、`pnpm build` 并做末轮复盘
