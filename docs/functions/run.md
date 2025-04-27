[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / run

# Function: run()

> **run**\<`T`\>(`fn`): `T`

Defined in: [run.ts:13](https://github.com/phonowell/fire-keeper/blob/main/src/run.ts#L13)

Executes a function immediately and returns its result with type preservation

## Type Parameters

### T

`T`

The return type of the function

## Parameters

### fn

(...`args`) => `T`

Function to execute

## Returns

`T`

The function's return value with preserved type

## Example

```ts
const num = run(() => 42) //=> 42
const user = run<User>(() => ({ id: 1, name: 'Alice' }))
```
