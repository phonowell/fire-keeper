[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / trimEnd

# Function: trimEnd()

> **trimEnd**(`source`, `chars`?): `string`

Defined in: [trimEnd.ts:29](https://github.com/phonowell/fire-keeper/blob/master/src/trimEnd.ts#L29)

Removes specified characters from the end of a string.

## Parameters

### source

`string`

The string to trim

### chars?

`string`

The characters to remove from the end. If omitted, removes whitespace

## Returns

`string`

The trimmed string

## Example

```typescript
// Trim whitespace
trimEnd('  hello  ');
//=> '  hello'

// Trim specific characters
trimEnd('hello...', '.');
//=> 'hello'

// Trim multiple characters
trimEnd('hello123', '123');
//=> 'hello'

// Trim special characters
trimEnd('hello\n\t', '\n\t');
//=> 'hello'

// No trimming needed
trimEnd('hello');
//=> 'hello'
```
