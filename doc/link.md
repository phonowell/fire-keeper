# $.link(source, target)

~~拯救海拉尔。~~建立软链接。

## 参数

- source - 待建立软链接的文件或目录
- target - 待建立软链接至的位置

## 示例

```coffeescript
await $.link './package.json', './shadow.json' # 文件
await $.link './test', './shadow' # 目录
```