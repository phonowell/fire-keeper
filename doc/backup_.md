# $.backup_(source)

备份文件。

## 参数

- source - 待备份的文件。不能备份目录哟

## 示例

```coffeescript
await $.backup_ './package.json'
# 在 ./ 下生成备份文件 package.json.bak
```

## 备注

- 可以通过 [`$.recover_()`](recover.md) 方法恢复备份。
