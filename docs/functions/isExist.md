[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / isExist

# Function: isExist()

> **isExist**(...`args`): `Promise`\<`boolean`\>

Defined in: [isExist.ts:15](https://github.com/phonowell/fire-keeper/blob/main/src/isExist.ts#L15)

Checks if all specified paths exist in filesystem

## Parameters

### args

...(`string` \| `string`[])[]

Paths to check (supports files, directories, symlinks)

## Returns

`Promise`\<`boolean`\>

Returns true only if all paths exist

## Throws

If any path contains glob pattern

## Example

```ts
await isExist('file.txt') //=> true/false
await isExist('dir/', ['a.txt', 'b.txt']) //=> true if all exist
```
