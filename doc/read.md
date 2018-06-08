# $.read(source, [option])

读取文件内容。

## 参数

- source - 待读取文件
- option - 可选参数
  - raw - 是否强制读取为`Buffer`类型

## 示例

```coffeescript
data = await $.read './package.json'
```

## 备注

`json`文件在读取时，会自动转为`Object`类型。

如下格式文件在读取时，会转为`String`类型：`coffee`，`css`，`html`，`js`，`md`，`pug`，`sh`，`styl`，`txt`，`xml`，`yaml`，`yml`。

其余格式文件在读取时，会作为`Biffer`类型读取。