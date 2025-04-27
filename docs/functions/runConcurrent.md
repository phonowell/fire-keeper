[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / runConcurrent

# Function: runConcurrent()

> **runConcurrent**\<`T`\>(`concurrency`, `tasks`, `options?`): `Promise`\<`T`[]\>

Defined in: [runConcurrent.ts:12](https://github.com/phonowell/fire-keeper/blob/main/src/runConcurrent.ts#L12)

Execute asynchronous tasks concurrently with controlled parallelism

## Type Parameters

### T

`T`

Type of value returned by tasks

## Parameters

### concurrency

`number`

Maximum number of tasks to run in parallel

### tasks

() => `Promise`\<`T`\>[]

Array of async task functions

### options?

Configuration options

#### stopOnError?

`boolean`

Stop all tasks on first error

## Returns

`Promise`\<`T`[]\>

Array of results in original task order

## Throws

When tasks fail and stopOnError is false

## Throws

When a task fails and stopOnError is true
