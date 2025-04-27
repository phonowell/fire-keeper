[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / prompt

# Function: prompt()

> **prompt**\<`T`, `U`\>(`option`): `Promise`\<`T` & `Result`\<`U`, `T`\>\>

Defined in: [prompt.ts:267](https://github.com/phonowell/fire-keeper/blob/main/src/prompt.ts#L267)

Interactive command-line prompting utility with type-safe inputs and caching

## Type Parameters

### T

`T`

Value type returned by the prompt

### U

`U` *extends* `Type` = `Type`

Prompt type ('text'|'number'|'select'|'multi'|'confirm'|'toggle'|'auto')

## Parameters

### option

`Option`\<`U`, `T`\> & `object`

Prompt configuration including type, message, default values, and constraints

## Returns

`Promise`\<`T` & `Result`\<`U`, `T`\>\>

Type-safe result based on prompt type:
text→string, number→number, select/auto→T, multi→T[], confirm/toggle→boolean

## Example

```ts
const env = await prompt({ type: 'select', message: 'Environment:', list: ['dev', 'prod'] })
```
