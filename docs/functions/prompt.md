[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / prompt

# Function: prompt()

> **prompt**\<`T`, `U`\>(`option`): `Promise`\<`T` & `Result`\<`U`, `T`\>\>

Defined in: [prompt.ts:306](https://github.com/phonowell/fire-keeper/blob/main/src/prompt.ts#L306)

Prompt the user.

## Type Parameters

• **T**

• **U** *extends* `Type` = `Type`

## Parameters

### option

`Option`\<`U`, `T`\> & `object`

The option.

## Returns

`Promise`\<`T` & `Result`\<`U`, `T`\>\>

The result.

## Example

```
// confirm
const result = await prompt({
  type: 'confirm',
  message: 'Are you sure?',
})

// number
const result = await prompt({
  type: 'number',
  message: 'Enter a number:',
  min: 1,
  max: 10,
})

// auto, multi, select
const result = await prompt({
  type: 'auto',
  message: 'Select a fruit:',
  list: ['Apple', 'Banana', 'Cherry'],
})

const result = await prompt({
  type: 'multi',
  message: 'Select fruits:',
  list: ['Apple', 'Banana', 'Cherry'],
})

const result = await prompt({
  type: 'select',
  message: 'Select a fruit:',
  list: ['Apple', 'Banana', 'Cherry'],
})

// text
const result = await prompt({
  type: 'text',
  message: 'Enter your name:',
})

// toggle
const result = await prompt({
  type: 'toggle',
  message: 'Enable feature?',
})
```
