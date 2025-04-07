[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / at

# Variable: at

> `const` **at**: `AtFn`

Defined in: [at.ts:104](https://github.com/phonowell/fire-keeper/blob/main/src/at.ts#L104)

Safely access nested properties in objects or arrays using path strings or indices.
Supports both array indexing (including negative indices) and object property access.
Returns undefined if any part of the path is invalid.

## Template

The expected type of the returned value

## Param

The object or array to access

## Param

Path segments to the desired value. Can be:
  - Array indices (numbers, including negative)
  - Object property names
  - Dot-notation strings (e.g., "a.b.c")
  - Mixed formats (e.g., "a.b", "c", "d" or "a", "b.c.d")

## Returns

The value at the specified path, or undefined if not found.
Special values like null, undefined, and NaN are preserved as-is.

## Example

```typescript
// Array access (positive and negative indices)
const arr = [1, 2, 3]
at(arr, 1)    // 2
at(arr, -1)   // 3 (last element)

// Object property access
const obj = { a: { b: { c: 1 } } }
at(obj, 'a', 'b', 'c')  // 1
at(obj, 'a.b.c')        // 1 (dot notation)
at(obj, 'x.y.z')        // undefined (safe access)

// Mixed access styles
at(obj, 'a.b', 'c')     // 1
at(obj, 'a', 'b.c')     // 1

// Special values
const special = { a: null, b: undefined, c: NaN }
at(special, 'a')        // null
at(special, 'b')        // undefined
at(special, 'c')        // NaN

// Mixed access with type preservation
interface User {
  friends: { name: string }[]
}
const user: User = {
  friends: [{ name: 'Alice' }, { name: 'Bob' }]
}
at<string>(user, 'friends', 0, 'name')  // 'Alice'
at(user, 'friends.1.name')              // 'Bob'
```
