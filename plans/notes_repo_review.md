# 仓库修复备注

- 范围：修复已确认的实现问题与文档契约偏差，不扩展新功能
- 风险：`exec` 失败语义调整可能影响依赖当前宽松行为的调用方
- 已处理：`exec` 保持数组命令“首条失败即停止”时，继续复用同一 shell 上下文，避免 `cd`/环境变量/别名丢失
- 已处理：`download` 已改为优先消费响应流，测试已补 `ReadableStream` 场景
- 推测，待确认：README/usage/llms 三份文档存在同类导入示例错误
- 已处理：README/usage/llms/llms.txt 子路径导入、`watch` glob、`normalizePath` 返回值、`glob` 选项名已对齐
- 已处理：`copy` 支持直传目录路径并补测试，匹配 README/usage 现有能力描述
- 验证：`pnpm lint` ✓ `pnpm test` ✓ `pnpm build` ✓
