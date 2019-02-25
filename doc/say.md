# $.say_(text)

使用`tts`输出一段音频。该方法仅供`macOS`使用。

## 参数

- source - 待输出的文字。若有多段文字，可组合为数组传入；文字中的部分特殊符号会被过滤掉
- option - 可选参数

## 示例

```coffeescript
# 调用系统默认语音朗读
await $.say_ '月下美人'

# 粤语
await $.say_ '月下美人',
  lang: 'zh-hk'

# 台湾方言
await $.say_ '月下美人',
  lang: 'zh-tw'

# 日语
await $.say_ '月下美人',
  lang: 'ja'
```