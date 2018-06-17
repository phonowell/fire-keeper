# $.isSame_(source)

判断文件内容是否相同。

## 参数

- source - 待判断的文件。只有当传入的所有文件内容都相同时，才会返回`true`

## 示例

```coffeescript
isSame = await $.isSame_ './doc/*.md'
```