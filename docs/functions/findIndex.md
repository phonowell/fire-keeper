[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / findIndex

# Function: findIndex()

> **findIndex**\<`T`\>(`list`, `fn`): `number`

Defined in: [findIndex.ts:24](https://github.com/phonowell/fire-keeper/blob/master/src/findIndex.ts#L24)

Returns the index of the first element in an array that satisfies the provided testing function.

## Type Parameters

• **T**

The type of elements in the array

## Parameters

### list

`T`[]

The array to search through

### fn

(`value`, `index`, `array`) => `boolean`

The testing function
  - param {T} value - The current element being processed in the array
  - param {number} index - The index of the current element being processed
  - param {T[]} array - The array findIndex was called upon

## Returns

`number`

The index of the first element that passes the test; -1 if no element passes

## Example

```typescript
// Find index of first even number
const numbers = [1, 3, 4, 6, 7];
const evenIndex = findIndex(numbers, x => x % 2 === 0); // returns 2

// Find index of specific object in array
const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
const userIndex = findIndex(users, user => user.id === 2); // returns 1

// When no element is found
const notFound = findIndex([1, 3, 5], x => x > 10); // returns -1
```
