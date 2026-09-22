# task_plan_cross_platform

- [x] 1. `os()` 增加 `linux` 返回值（含类型、JSDoc、测试）
- [x] 2. `normalizePath` 在 POSIX 上识别 `C:/` 盘符为绝对路径（含测试）
- [x] 3. `ci.yml` verify job 增加 `ubuntu/windows/macos` matrix（fail-fast: false）
- [ ] 4. `pnpm lint && pnpm test` 验证
- [-] 5. `release.yml` 保持 ubuntu 单平台：发布只需一处 provenance，跨平台验证由 CI 在每次 push 把关
