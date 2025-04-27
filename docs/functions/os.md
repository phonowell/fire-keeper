[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / os

# Function: os()

> **os**(): `"unknown"` \| `"macos"` \| `"windows"`

Defined in: [os.ts:13](https://github.com/phonowell/fire-keeper/blob/main/src/os.ts#L13)

Gets the current operating system identifier

## Returns

`"unknown"` \| `"macos"` \| `"windows"`

Operating system identifier: 'macos' for macOS/Darwin, 'windows' for Windows, or 'unknown' for other systems

## Example

```ts
os()
//=> 'macos' // On macOS/Darwin systems
//=> 'windows' // On Windows systems
//=> 'unknown' // On other systems like Linux
```
