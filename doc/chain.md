# $$.chain(fn)

链式调用。

## 参数

- fn - 待传入的`Promise`函数

## 示例

```coffeescript
source = './temp/test.txt'
text = 'A test message.'

string = await $$.chain $$.write source, text
.read source

console.log string == text # true
```