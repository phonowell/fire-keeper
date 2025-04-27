[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / flatten

# Function: flatten()

> **flatten**\<`T`\>(`array`): `T`[]

Defined in: [flatten.ts:14](https://github.com/phonowell/fire-keeper/blob/main/src/flatten.ts#L14)

Flattens nested arrays into a single-level array

## Type Parameters

### T

`T`

Element type

## Parameters

### array

(`T` \| `T`[])[]

## Returns

`T`[]

Single-level array with preserved order

## Example

```ts
// Basic flattening
flatten([1, [2, [3]], 4]) // [1, 2, 3, 4]

// With complex types
flatten([user, [user2], [[user3]]]) // [user, user2, user3]
```
