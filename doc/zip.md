# $$.zip(source, [target], [option])

文件打包。

## 参数

- source - 待打包的文件。注意，如果想要打包`./source`下的所有文件，则应传入`./source/*`；否则将只会打包一个空目录
- target - 输出路径。如若不填，将会输出至待打包文件的同级目录
- option - 文件名。如若不填，则为待打包文件所处目录的目录名 + `.zip`

## 示例

```coffeescript
await $$.zip './source/*', './', 'source.zip'
```