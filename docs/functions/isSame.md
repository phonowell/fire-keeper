[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / isSame

# Function: isSame()

> **isSame**(...`args`): `Promise`\<`boolean`\>

Defined in: [isSame.ts:16](https://github.com/phonowell/fire-keeper/blob/main/src/isSame.ts#L16)

Compares files for binary content equality

## Parameters

### args

...(`string` \| `string`[])[]

Paths to compare (min 2 paths required)

## Returns

`Promise`\<`boolean`\>

True if all files exist and have identical content

## Example

```ts
await isSame('file1.txt', 'file2.txt')
await isSame(['v1.txt', 'v2.txt'], 'v3.txt')
await isSame('./path/file.txt', './other/../file.txt') // normalizes paths
```
