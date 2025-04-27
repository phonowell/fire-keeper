[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / copy

# Function: copy()

> **copy**(`source`, `target?`, `options?`): `Promise`\<`void`\>

Defined in: [copy.ts:32](https://github.com/phonowell/fire-keeper/blob/main/src/copy.ts#L32)

Copy files with concurrent operations and flexible path handling

## Parameters

### source

File path(s) or glob pattern(s)

`string` | `string`[]

### target?

`Dirname`

Target directory or path transform function. If empty uses current dir

### options?

Target filename or options object with {concurrency?, filename?}

`Dirname` | `Options`

## Returns

`Promise`\<`void`\>

## Example

```ts
copy('src.txt') // Creates src.copy.txt
copy('src.txt', 'dist') // Creates dist/src.txt
copy('*.ts', 'dist', { filename: f => f.replace('.ts','.js') })
```
