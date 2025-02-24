[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / at

# Function: at()

> **at**\<`T`\>(`input`, `key`): `undefined` \| `T`

Defined in: [at.ts:29](https://github.com/phonowell/fire-keeper/blob/master/src/at.ts#L29)

Get the value at the specified index or key.

## Type Parameters

• **T**

## Parameters

### input

The input.

`Record`\<`string`, `T`\> | `T`[]

### key

The index or key.

`string` | `number`

## Returns

`undefined` \| `T`

The value at the specified index or key.

## Example

```
const array = [1, 2, 3]
console.log(at(array, 1))
//=> 2
console.log(at(array, -1))
//=> 3
console.log(at(array, 3))
//=> undefined

const object = { a: 1, b: 2, c: 3 }
console.log(at(object, 'b'))
//=> 2
console.log(at(object, 'd'))
//=> undefined
```
