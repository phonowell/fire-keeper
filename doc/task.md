# $.task(name, [fn])

设置或获取任务。

## 参数

- name - 任务名。注意，当任务名已存在时，会覆盖之前所设置的任务。若不传入任何任务名，则会返回当前所有已设置的任务列表
- fn - 分配函数。注意，若传入函数类型并非`async function`，则其将会被转为`async function`

## 示例

```coffeescript
# 设置一个新任务
# 该任务可在命令行中通过`gulp foo`执行
$.task 'foo', ->
  await $.delay_ 1e3
  await $.say_ 'hey'

# 获取并执行已设置的任务
fn_ = $.task 'foo'
await fn_()
```
