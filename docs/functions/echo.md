[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / echo

# Function: echo()

> **echo**\<`T`\>(...`args`): `T`

Defined in: [echo.ts:33](https://github.com/phonowell/fire-keeper/blob/master/src/echo.ts#L33)

Print a message with optional type prefix and formatting

## Type Parameters

• **T**

## Parameters

### args

Single message or [type, message] tuple

\[`T`\] | \[`string`, `T`\]

## Returns

`T`

The original message

## Example

```typescript
// Simple message
echo('Hello, world!')
// => [12:34:56] › Hello, world!

// Typed message
echo('info', 'Operation completed')
// => [12:34:56] › info      Operation completed
```
