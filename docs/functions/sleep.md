[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / sleep

# Function: sleep()

> **sleep**(`delay`): `Promise`\<`void`\>

Defined in: [sleep.ts:15](https://github.com/phonowell/fire-keeper/blob/main/src/sleep.ts#L15)

Sleep for a specified duration.

## Parameters

### delay

`number` = `0`

The delay in milliseconds. Default is 0ms.
Negative values are treated as 0. Float values are accepted.
When delay > 0, logs a message with the sleep duration.

## Returns

`Promise`\<`void`\>

A promise that resolves after the delay.

## Example

```
await sleep(1000) // sleeps for 1 second
await sleep() // minimal delay
```
