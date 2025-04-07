[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / run

# Function: run()

> **run**\<`T`\>(`fn`): `T`

Defined in: [run.ts:26](https://github.com/phonowell/fire-keeper/blob/main/src/run.ts#L26)

Executes a function and returns its result. Useful for immediately invoking functions
that return values or have side effects.

## Type Parameters

### T

`T`

The return type of the function

## Parameters

### fn

(...`args`) => `T`

The function to execute. Can be an arrow function,
                                       regular function, or any callable that returns type T

## Returns

`T`

The value returned by the function

## Example

```typescript
// Basic value return
const value = run(() => 42)  // returns 42

// Object return with type preservation
interface Config { port: number }
const config = run<Config>(() => ({ port: 3000 }))

// Side effects
run(() => {
  console.log('Side effect')
  localStorage.clear()
})
```
