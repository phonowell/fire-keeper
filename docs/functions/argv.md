[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / argv

# Function: argv()

> **argv**(): `Promise`\<\{ `[x: string]`: `unknown`;  `_`: (`string` \| `number`)[]; `$0`: `string`; \}\>

Defined in: [argv.ts:13](https://github.com/phonowell/fire-keeper/blob/862cc844119f7a539be35ffaeee5bfb3fdb4b3cd/src/argv.ts#L13)

Get the arguments.

## Returns

`Promise`\<\{ `[x: string]`: `unknown`;  `_`: (`string` \| `number`)[]; `$0`: `string`; \}\>

The arguments.

## Example

```
const args = await argv()
console.log(args)
```
