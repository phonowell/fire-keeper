[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / root

# Function: root()

> **root**(): `string`

Defined in: [root.ts:13](https://github.com/phonowell/fire-keeper/blob/main/src/root.ts#L13)

Gets the normalized absolute path of the current working directory

## Returns

`string`

Normalized absolute path using forward slashes

## Example

```ts
root()
//=> '/Users/project/src'
```

## Throws

For invalid paths (empty, containing forbidden characters, or relative components)
