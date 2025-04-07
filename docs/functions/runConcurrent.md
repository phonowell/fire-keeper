[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / runConcurrent

# Function: runConcurrent()

> **runConcurrent**\<`T`\>(`concurrency`, `tasks`, `options`): `Promise`\<`T`[]\>

Defined in: [runConcurrent.ts:9](https://github.com/phonowell/fire-keeper/blob/main/src/runConcurrent.ts#L9)

Execute asynchronous tasks concurrently.

## Type Parameters

### T

`T`

## Parameters

### concurrency

`number`

The maximum number of concurrent tasks.

### tasks

() => `Promise`\<`T`\>[]

An array of asynchronous tasks to be executed.

### options

Configuration options.

#### stopOnError?

`boolean`

## Returns

`Promise`\<`T`[]\>

An array of task execution results.

## Throws

When a task execution fails and stopOnError is not configured.
