[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / trimEnd

# Function: trimEnd()

> **trimEnd**(`source`, `chars?`): `string`

Defined in: [trimEnd.ts:15](https://github.com/phonowell/fire-keeper/blob/main/src/trimEnd.ts#L15)

Removes specified characters from the end of a string.

## Parameters

### source

`string`

The string to trim

### chars?

`string`

Characters to remove from the end (defaults to whitespace)

## Returns

`string`

The trimmed string

## Example

```
trimEnd('  hello  ')      // '  hello'
trimEnd('hello...', '.') // 'hello'
trimEnd('hello123', '123') // 'hello'
trimEnd('hello\n\t', '\n\t') // 'hello'
trimEnd('hello世界', '世界') // 'hello'
```
