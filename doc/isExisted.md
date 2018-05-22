# $$.isExisted(source)

判断文件是否存在。

## 参数

- source - 待判断的文件或目录。只有当传入的所有文件都存在时，才会返回`true`

## 示例

```coffeescript
isExisted = await $$.isExisted './unexisted'
```