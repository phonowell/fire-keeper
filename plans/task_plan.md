# Task Plan: update use-fire-keeper reference/examples

## Goal
- 更新 reference.md/examples.md（≤200 行），对齐 fire-keeper 实际 API/行为

## Steps
- [x] 1. 阅读现有 reference.md/examples.md
- [x] 2. 重写 reference.md（签名/行为/约束）
- [x] 3. 重写 examples.md（示例符合 API，代码块无注释）
- [x] 4. 校验行数与一致性（wc -l）

## Files
- ~/Projects/claude-skills/skills/use-fire-keeper/reference.md
- ~/Projects/claude-skills/skills/use-fire-keeper/examples.md
- ./plans/task_plan.md

## Decisions
- 采用 optimize-skill + optimize-docs 规范，保留替代规则表

## Risks
- API 行为理解偏差（以源码/测试为准）
