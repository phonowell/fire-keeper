# $$.delay([time], [callback])

等待一段时间。

## 参数

- time - 等待时长。单位为`ms`，缺省则为`0`
- callback - 等待时长结束后执行的回调

## 示例

```coffeescript
await $$.delay 500
```