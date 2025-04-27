[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / at

# Variable: at

> `const` **at**: `AtFn`

Defined in: [at.ts:70](https://github.com/phonowell/fire-keeper/blob/main/src/at.ts#L70)

Safely access nested values in arrays or objects

## Template

Expected return type

## Param

Target array or object

## Param

Access path as numbers (array indices), strings (object keys), or dot notation

## Returns

Value at path or undefined if not found

## Example

```ts
// Array access (positive/negative indices)
at([1, 2, 3], 1)    // 2
at([1, 2, 3], -1)   // 3

// Object access (key/path)
at({a: {b: 1}}, 'a.b')      // 1
at({a: {b: 1}}, 'a', 'b')   // 1
```
