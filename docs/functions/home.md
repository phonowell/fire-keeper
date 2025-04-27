[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / home

# Function: home()

> **home**(): `string`

Defined in: [home.ts:14](https://github.com/phonowell/fire-keeper/blob/main/src/home.ts#L14)

Get normalized user home directory path

## Returns

`string`

Absolute home path with forward slashes

## Example

```ts
// Unix-like systems
home() //=> '/Users/username'

// Windows (normalized)
home() //=> 'C:/Users/username'
```
