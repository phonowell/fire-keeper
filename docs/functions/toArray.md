[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / toArray

# Function: toArray()

> **toArray**\<`T`\>(`input`): `T`[]

Defined in: [toArray.ts:14](https://github.com/phonowell/fire-keeper/blob/main/src/toArray.ts#L14)

Convert any value to an array. If already an array, returns it unchanged.

## Type Parameters

### T

`T`

The type of elements in the array

## Parameters

### input

The value to convert to an array

`T` | `T`[]

## Returns

`T`[]

An array containing the input value, or the input itself if already an array

## Example

```
toArray(42)          // [42]
toArray('hello')     // ['hello']
toArray([1, 2, 3])   // [1, 2, 3]
toArray({key: 'value'}) // [{key: 'value'}]
```
