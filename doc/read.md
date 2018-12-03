# $.read_(source, [option])

读取文件内容。

## 参数

- source - 待读取文件
- option - 可选参数
  - raw - 是否强制读取为`Buffer`类型

## 示例

```coffeescript
data = await $.read_ './package.json'
```

## 备注

如下格式文件在读取时，会自动转为`Object`或`Array`类型：`json`，`yaml`，`yml`。

如下格式文件在读取时，会自动转为`String`类型：`coffee`，`css`，`html`，`js`，`md`，`pug`，`sh`，`styl`，`txt`，`xml`。

其余格式文件在读取时，会转为`Buffer`类型。