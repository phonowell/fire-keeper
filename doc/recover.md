# $.recover_(source)

恢复备份。

## 参数

- source - 待恢复的文件。注意，此处传入的参数应为待恢复的文件本身，而非备份文件

## 示例

```coffeescript
await $.recover_ './package.json'
# 使用 ./ 下的 package.json.bak 覆盖同一目录下的 package.json
# 并删除 package.json.bak
```