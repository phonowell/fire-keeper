[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / wrapList

# Function: wrapList()

> **wrapList**(`input`): `string`

Defined in: [wrapList.ts:24](https://github.com/phonowell/fire-keeper/blob/main/src/wrapList.ts#L24)

Converts input to a comma-separated string with each item wrapped in single quotes.

## Parameters

### input

`unknown`

Any value (primitives, arrays, objects)

## Returns

`string`

A string with items wrapped in quotes and joined with commas

## Example

```ts
// Arrays of primitives
wrapList(['a', 'b', 'c'])
//=> "'a', 'b', 'c'"

// Single values are also processed
wrapList(123)
//=> "'123'"

// Objects are JSON stringified
wrapList({name: 'test'})
//=> "'{"name":"test"}'"

// Null and undefined become empty strings
wrapList([null, undefined])
//=> ", "
```
