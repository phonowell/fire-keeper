[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / toArray

# Function: toArray()

> **toArray**\<`T`\>(`input`): `T`[]

Defined in: [toArray.ts:14](https://github.com/phonowell/fire-keeper/blob/862cc844119f7a539be35ffaeee5bfb3fdb4b3cd/src/toArray.ts#L14)

Convert a value to an array if it is not already an array.

## Type Parameters

• **T**

## Parameters

### input

The value to convert to an array.

`T` | `T`[]

## Returns

`T`[]

The value as an array.

## Example

```
console.log(toArray(1))
//=> [1]

console.log(toArray([1, 2, 3]))
//=> [1, 2, 3]
```
