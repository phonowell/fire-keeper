[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / root

# Function: root()

> **root**(): `string`

Defined in: [root.ts:18](https://github.com/phonowell/fire-keeper/blob/main/src/root.ts#L18)

Gets the normalized absolute path of the current working directory

## Returns

`string`

Normalized absolute path using forward slashes

## Example

```ts
root()
//=> '/Users/project/src' (on Unix-like systems)

root()
//=> 'C:/Users/project/src' (on Windows)
```

## Throws

For invalid paths (empty, containing forbidden characters, or relative components)
