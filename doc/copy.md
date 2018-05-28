# $$.copy(source, target, [option])

复制文件。

## 参数

- source - 待复制的文件
- target - 待复制至的目录
- option - 可选参数。详情参见[`$$.rename()`](rename.md)

## 示例

```coffeescript
await $$.copy './package.json', './template'
```