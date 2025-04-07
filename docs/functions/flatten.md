[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / flatten

# Function: flatten()

> **flatten**\<`T`\>(`array`): `T`[]

Defined in: [flatten.ts:32](https://github.com/phonowell/fire-keeper/blob/main/src/flatten.ts#L32)

Flattens a nested array structure into a single-level array.
Preserves the type and order of elements while removing nesting.

## Type Parameters

### T

`T`

The type of elements in the array

## Parameters

### array

(`T` \| `T`[])[]

## Returns

`T`[]

A new array with all nested elements at the top level

## Example

```typescript
// Basic flattening
flatten([1, [2, 3], [4]])  // [1, 2, 3, 4]

// Empty arrays are removed
flatten([1, [], [2], [], [3]])  // [1, 2, 3]

// Works with any type
flatten(['a', ['b', 'c']])  // ['a', 'b', 'c']

// Complex types are preserved
interface User { id: number }
const users: (User | User[])[] = [
  { id: 1 },
  [{ id: 2 }, { id: 3 }]
]
flatten(users)  // [{ id: 1 }, { id: 2 }, { id: 3 }]

// Handles deeply nested structures
flatten([1, [2, [3, [4]]]])  // [1, 2, 3, 4]
```
