# $.copy_(source, target, [option])

复制文件。

## 参数

- source - 待复制的文件
- target - 待复制至的目录
- option - 可选参数。详情参见[`$.rename_()`](rename.md)

## 示例

```coffeescript
await $.copy_ './package.json', './template' # 单个文件
await $.copy_ './test/*', './shadow' # 多个文件
```