[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / prompt

# Function: prompt()

> **prompt**\<`T`, `U`\>(`option`): `Promise`\<`T` & `Result`\<`U`, `T`\>\>

Defined in: [prompt.ts:338](https://github.com/phonowell/fire-keeper/blob/main/src/prompt.ts#L338)

Interactive command-line prompting utility with multiple input types and caching support.
Supports various types of prompts including text input, number input, single/multi selection,
confirmation, and toggle switches.

## Type Parameters

### T

`T`

The type of prompt ('text', 'number', 'select', 'multi', 'confirm', 'toggle', 'auto')

### U

`U` *extends* `Type` = `Type`

The expected return type based on the prompt type

## Parameters

### option

`Option`\<`U`, `T`\> & `object`

Configuration options for the prompt

## Returns

`Promise`\<`T` & `Result`\<`U`, `T`\>\>

The user's response, type varies based on prompt type:
  - text: string
  - number: number
  - select/auto: U (selected value)
  - multi: U[] (array of selected values)
  - confirm/toggle: boolean

## Example

```typescript
// Text input
const name = await prompt({
  type: 'text',
  message: 'Enter your name:',
  default: 'Guest'
})

// Number with range
const age = await prompt({
  type: 'number',
  message: 'Enter your age:',
  min: 0,
  max: 120
})

// Single selection
const fruit = await prompt({
  type: 'select',
  message: 'Choose a fruit:',
  list: ['Apple', 'Banana', 'Orange']
})

// Multiple selection
const fruits = await prompt({
  type: 'multi',
  message: 'Select fruits:',
  list: [
    { title: '🍎 Apple', value: 'apple' },
    { title: '🍌 Banana', value: 'banana' }
  ]
})

// Confirmation
const confirm = await prompt({
  type: 'confirm',
  message: 'Proceed?',
  default: true
})

// Toggle switch
const enabled = await prompt({
  type: 'toggle',
  message: 'Enable feature:',
  on: 'Enabled',
  off: 'Disabled'
})

// With response caching
const config = await prompt({
  type: 'text',
  id: 'server.host',  // Cache key
  message: 'Server hostname:',
  default: 'localhost'
})
```
