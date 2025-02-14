# Fire Keeper

一个简单的工具箱。

## 安装

```shell
pnpm i fire-keeper
```

## 使用

首先，在代码中引入模块。

```typescript
import $ from 'fire-keeper'
```

之后就可以愉快地玩耍啦。

```typescript
$.echo('hello world')
```

当然，也可以按需加载。

```typescript
import echo from 'fire-keeper/dist/echo'
echo('hello world')
```

## 构建

```shell
npm run build
```

## 测试

```shell
npm run test
```

## 文档

- [argv](#argv)
- [backup](#backup)
- [copy](#copy)
- [download](#download)
- [echo](#echo)
- [exec](#exec)
- [getBasename](#getBasename)
- [getDirname](#getDirname)
- [getExtname](#getExtname)
- [getFilename](#getFilename)
- [getName](#getName)
- [glob](#glob)
- [home](#home)
- [isExist](#isExist)
- [isSame](#isSame)
- [link](#link)
- [mkdir](#mkdir)
- [move](#move)
- [normalizePath](#normalizePath)
- [os](#os)
- [prompt](#prompt)
- [read](#read)
- [recover](#recover)
- [remove](#remove)
- [rename](#rename)
- [root](#root)
- [sleep](#sleep)
- [stat](#stat)
- [toArray](#toArray)
- [toDate](#toDate)
- [watch](#watch)
- [write](#write)
- [zip](#zip)

### argv

获取`argv`。

```typescript
const argv = $.argv()
```

### backup

备份文件。

```typescript
await $.backup('./readme.md') // 生成`./readme.md.bak`
```

### copy

复制文件。

```typescript
await $.copy('./readme.md', './temp')
```

### download

下载文件。

```typescript
await $.download('http://example.com', './temp')
```

### echo

在控制台显示信息。

```typescript
$.echo('hello world')
$.echo('error', 'a error message')
```

### exec

执行命令。

```typescript
await $.exec('npm run build')
```

### getBasename

获取`basename`。

```typescript
const basename = $.getBasename('./readme.md') // `readme`
```

### getDirname

获取`dirname`。

```typescript
const dirname = $.getDirname('./readme.md') // `./`的绝对路径
```

### getExtname

获取`extname`。

```typescript
const extname = $.getExtname('./readme.md') // `.md`
```

### getFilename

获取`filename`。

```typescript
const filename = $.getFilename('./readme.md') // `readme.md`
```

### getName

获取文件名。

```typescript
const name = $.getName('./readme.md')
```

### glob

获取文件列表。

```typescript
const listSource = await $.glob('./source/**/*')
```

### home

获取用户主目录。

```typescript
const home = $.home()
```

### isExist

判断文件是否存在。

```typescript
const isExist = await $.isExist('./readme.md')
```

### isSame

判断两个文件是否相同。

```typescript
const isSame = await $.isSame('./readme.md', './readme.md.bak')
```

### link

创建软链接。

```typescript
await $.link('./readme.md', './temp/readme.md')
```

### mkdir

创建目录。

```typescript
await $.mkdir('./temp')
```

### move

移动文件。

```typescript
await $.move('./readme.md', './temp')
```

### normalizePath

规范化路径。

```typescript
const path = $.normalizePath('./readme.md')
```

### os

获取操作系统类型。

```typescript
const os = $.os()
```

### prompt

提示用户输入。

```typescript
const answer = await $.prompt({
  list: ['a', 'b', 'c'],
  message: 'choose a letter',
  type: 'select',
})
```

### read

读取文件。

```typescript
const content = await $.read('./readme.md')
```

### recover

恢复文件。

```typescript
await $.recover('./readme.md') // 从`./readme.md.bak`恢复
```

### remove

删除文件。

```typescript
await $.remove('./temp')
```

### rename

重命名文件。

```typescript
await $.rename('./readme.md', 'readme-new.md')
```

### root

获取项目根目录。

```typescript
const root = $.root()
```

### sleep

休眠。

```typescript
await $.sleep(1e3)
```

### stat

获取文件状态。

```typescript
const stat = await $.stat('./readme.md')
```

### toArray

转换为数组。

```typescript
const list = $.toArray('hello world') // `['hello world']`
```

### toDate

转换为日期。

```typescript
const date = $.toDate('2020-01-01') // `new Date('2020-01-01')`
```

### watch

监听文件变化。

```typescript
$.watch('./source/**/*', path => $.echo(path))
```

### write

写入文件。

```typescript
await $.write('./readme.md', 'hello world')
```

### zip

压缩文件。

```typescript
await $.zip('./source/**/*', './temp/source.zip')
```
