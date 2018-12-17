# $.source_(source, [option])

返回资源列表。

## 参数

- source - 待返回的文件或目录
- option - 额外参数。参考`gulp.src()`

## 示例

```coffeescript
listSource = await $.source_ './source/*'
```