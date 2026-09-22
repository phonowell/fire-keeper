# AGENTS.md

## 关键约束

- 仅默认导出：`src/*.ts` 仅 `export default fn`
- 自动生成禁编辑：`dist/` · `src/index.ts` · `package.json` exports（tsdown 生成）
- 相对导入必带 `.js`：`import x from './x.js'`
- 改代码必改测试
- 元原则：精简冗余 · 冲突信代码
- 客观诚实：不主观评价 · 不因用户情绪转移立场 · 不编造事实 · 立刻暴露不确定信息
- 类型规范：≥5 处非空断言立即重构类型架构（🚫 lint-disable 批量压制）
- 计划管理：≥3 步任务用 `/plans/task_plan_{suffix}.md` 并持续更新
- TodoWrite：≥3 步骤任务必须建 todo · 实时更新状态 · 完成立即标记

## 技术栈

- Node.js/TS · 纯 ESM · Node ≥24
- Vitest（`fileParallelism: false`）· tsdown/Rolldown · Oxlint + Oxfmt

## 核心命令

- `pnpm test` 串行
- `pnpm build` 测试→生成 `src/index.ts`→tsdown 打包+声明+exports
- `pnpm lint`
- `pnpm task [name]`

## 发布

- tag 驱动：`package.json` 升 version → `git commit -m "0.0.x"` → `git tag v0.0.x` → `git push origin main --tags`
- `.github/workflows/release.yml`：tag push → lint/test/build → `npm publish --provenance` → GitHub Release
- npm 认证 = OIDC trusted publishing（无 token）：npmjs 包 Settings → Trusted Publisher = `phonowell/fire-keeper` + `release.yml`
- 仅 tag 触发发布且前置全绿；手动兜底 `npm login && pnpm publish --access public`

## 目录结构

- `src/` 默认导出 · `test/` 对应测试 · `dist/` 自动生成
- API 文档唯一来源 = `src/*.ts` JSDoc → `pnpm build` 生成 `dist/api.md`；勿另建 usage.md/llms.txt 类平行文档
- `tasks/index.ts` 动态发现；命名 `subdir@file` → 执行 `file/subdir`
- 临时文件 `temp/<模块>/` + `beforeEach`/`afterEach` 清理
- `@/*` 仅测试用

## 工作流

- TDD：`test/<name>.test.ts` → `src/<name>.ts`
- 新增工具：用例先行 → 默认导出 → `pnpm build` 自动重写配置
- 测试覆盖：✅ 业务逻辑/参数验证/错误处理/项目特有功能（`ListSource` · `echo` 路径简化）/跨平台 · 🚫 第三方库/JS 原生/OS 输出/时间精度
- 常见坑：编辑自动生成文件/命名导出/导入忘 `.js`/改代码忘改测试/数组索引未判空（`noUncheckedIndexedAccess`）/测试假定并行/`echo` 用绝对路径/测试第三方库

## Skill 使用

- 任务匹配 skill 列表→先开对应 `SKILL.md` 按流程执行；多 skill 按顺序；缺失/不可读则说明并回退
- 调用 skill 后等待完成再执行

## 代码规范

- `import type { T }` · 优先 `type` 非 `interface` · 禁 `public`
- 数组访问返回 `T | undefined` 必检查：`const x = arr.at(0); if (!x) return`
- `glob()` 返回 `ListSource` 品牌类型缓存重用
- `echo(tag, msg)`/`echo(msg)` · 路径简化 `.`/`~` · 静默 `freeze/whisper/pause/resume` · 无匹配需 `echo('mod', 'no files found ...')` + 早返回
- Oxlint（`--type-aware`）：禁 `public` · 强制 `import type` · 优先 `type` · 相对导入需 `.js` · `node:` 协议前缀 · Oxfmt（无分号/单引号/尾随逗号/排序导入）

**文件操作模板**

```typescript
const fn = async (source: string | string[], { concurrency = 5 }: Options = {}) => {
  const listSource = await glob(source)
  if (!listSource.length) {
    echo('fn', `no files found matching ${wrapList(source)}`)
    return
  }
  await runConcurrent(
    concurrency,
    listSource.map((src) => async () => {
      await handleFile(src)
    }),
  )
  echo('fn', `processed ${wrapList(source)}`)
}
```

## 输出格式

- 禁预告文字 · 状态用符号 ✓/✗/→ · 一次性批量 Edit · 数据优先 · 直达结论 · 工具间隔零输出 · 错误格式 `✗ {位置}:{类型}` · 代码块零注释 · ≥2 条用列表 · 路径缩写（. 项目根 · ~ 主目录）· 禁总结性重复 · 进度 {当前}/{总数} · 提问直入
