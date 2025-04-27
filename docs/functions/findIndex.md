[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / findIndex

# Function: findIndex()

> **findIndex**\<`T`\>(`list`, `fn`): `number`

Defined in: [findIndex.ts:18](https://github.com/phonowell/fire-keeper/blob/main/src/findIndex.ts#L18)

Find the first array element's index that matches a predicate

## Type Parameters

### T

`T`

Array element type

## Parameters

### list

`T`[]

The array to search

### fn

(`value`, `index`, `array`) => `boolean`

Test function

## Returns

`number`

First matching index or -1 if not found

## Example

```ts
// Basic search
findIndex([1, 2, 3], x => x > 1) // returns 1

// With objects
findIndex(users, u => u.id === 2)

// Type-safe predicate
findIndex(items, (x): x is Item => x.type === 'test')
```
