[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / echo

# Function: echo()

> **echo**\<`T`\>(...`args`): `T`

Defined in: [echo.ts:63](https://github.com/phonowell/fire-keeper/blob/main/src/echo.ts#L63)

Enhanced console logging utility with formatting, message types, and flow control.

## Type Parameters

### T

`T`

The type of the message to log

## Parameters

### args

Either:
  - Single argument: The message to log (uses 'default' type)
  - Two arguments: [type, message] where type affects formatting

\[`T`\] | \[`string`, `T`\]

## Returns

`T`

The message that was logged (for chaining)

## Example

```typescript
// Basic logging
echo('Hello world')               // Basic gray text
echo('info', 'Processing...')     // With type prefix

// Message types with different formatting
echo('error', 'Failed to connect')  // Red error text
echo('success', 'Completed')        // Green success text

// Return value chaining
const config = echo('config', { port: 3000 })  // Logs and returns config

// Flow control
echo.pause()
echo('Silent operation')  // Nothing logged
echo.resume()

// Async operation with temporary silence
await echo.freeze(async () => {
  await heavyOperation()  // Output suppressed
})

// Minimal logging
await echo.whisper(async () => {
  // Minimal output formatting
})
```
