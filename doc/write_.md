# $.write_(source, data, [option])

写入文件内容。

## 参数

- source - 待写入文件。若文件不存在，则会创建新文件
- data - 待写入数据。类型为`Array`和`Object`的数据，会被转换为`String`类型后写入
- option - 可选参数。详情参见`fs-extra`的`outputFile()`方法

## 示例

```coffeescript
await $.write_ './test.txt', 'A test message.'
```
