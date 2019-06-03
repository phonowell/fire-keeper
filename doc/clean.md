# $.clean_(source)

删除文件。如果被删除文件所处目录被清空，将会一并删除目录。

## 参数

- source - 待删除的文件或目录

## 示例

```coffeescript
await $.clean_ './temp/test.txt'
```
