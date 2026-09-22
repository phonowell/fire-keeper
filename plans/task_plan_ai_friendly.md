# task_plan_ai_friendly

- [x] 1. `copy` 删除第 4 参 `EchoOption`，`echo` 统一走 `Options.echo`（move/backup 已是对象传参）
- [x] 2. `write` 的 `echo` 并入 `fse.WriteFileOptions & { echo? }`，内部解构剥离后传给 fse；`recover` 调用点同步
- [x] 3. `zip` 的 `echo` 并入 `Options`（`{ base?, filename?, echo? }`），删除第 4 参；顺带修复 progress 日志绕过 `echo:false` 的泄漏
- [x] 4. `isSame` 保持不动：可变参数尾部 `{ echo }` 本身就是其 options 对象，签名已清晰
- [x] 5. `tasks/build.ts` 新增 `makeApiDoc`：从 `src/*.ts` JSDoc 生成 `dist/api.md`（files: dist/** 自动随包发布）
- [x] 6. 删除 `usage.md`：仅覆盖 12/40 且不发布，`.d.ts` JSDoc 才是唯一真实接口
- [x] 7. 测试同步：echoOption.test.ts 三处调用点改为 options.echo 形式
- [x] 8. 同步 `~/.cursor/skills/fire-keeper-guide/reference.md` 签名说明（copy/write/zip echo 收敛 + api.md 入口）
- [x] 9. `pnpm lint && pnpm test && pnpm build` 全绿，`dist/api.md` 产出 505 行覆盖全部模块
