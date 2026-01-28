# Notes: use-fire-keeper reference/examples update

## Findings
- 参考文档存在签名错误：write 参数顺序、download/zip/watch 签名、root/home 参数
- 行为缺失：download 默认参数先触发 getFilename；sleep 仅 ms>0 记录 echo；stat/read 无匹配返回 null/undefined
- copy/backup/read 仅文件（glob onlyFiles=true），remove/clean 支持目录

## Open Questions
- 无
