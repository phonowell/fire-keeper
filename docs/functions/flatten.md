[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / flatten

# Function: flatten()

> **flatten**\<`T`\>(`array`): `T`[]

Defined in: [flatten.ts:20](https://github.com/phonowell/fire-keeper/blob/main/src/flatten.ts#L20)

Flattens a nested array structure into a single-level array.

## Type Parameters

• **T**

The type of elements in the array

## Parameters

### array

(`T` \| `T`[])[]

The array to flatten, which may contain nested arrays

## Returns

`T`[]

A new array with all sub-array elements concatenated recursively

## Example

```typescript
// Flatten numbers array
const numbers = [1, [2, 3], [4, [5, 6]]];
const flat = flatten(numbers); // [1, 2, 3, 4, 5, 6]

// Flatten string array
const words = ['hello', ['world', ['typescript']]];
const flat = flatten(words); // ['hello', 'world', 'typescript']

// Empty array returns empty array
const empty = flatten([]); // []
```
