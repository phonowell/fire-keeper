[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / argv

# Function: argv()

> **argv**(): `Promise`\<\{[`x`: `string`]: `unknown`; `_`: (`string` \| `number`)[]; `$0`: `string`; \}\>

Defined in: [argv.ts:17](https://github.com/phonowell/fire-keeper/blob/main/src/argv.ts#L17)

Parses command line arguments using yargs

## Returns

`Promise`\<\{[`x`: `string`]: `unknown`; `_`: (`string` \| `number`)[]; `$0`: `string`; \}\>

Object containing:
- Named arguments as properties (--key=value becomes {key: 'value'})
- Positional arguments in _ array
- Script name in $0

## Example

```ts
const args = await argv()
// node script.js --name=value file1.txt --flag
console.log(args.name)  // 'value'
console.log(args._)     // ['file1.txt']
console.log(args.flag)  // true
```
