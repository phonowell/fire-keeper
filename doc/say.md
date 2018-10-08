# $.say_(text)

使用`tts`输出一段音频。该方法仅供`macOS`使用。

## 参数

- source - 待输出的文字。若有多段文字，可组合为数组传入；文字中的部分特殊符号会被过滤掉

## 示例

```coffeescript
await $.say_ '诶嘿！'
```