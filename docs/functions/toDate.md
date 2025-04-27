[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / toDate

# Function: toDate()

> **toDate**(`input`): `Date`

Defined in: [toDate.ts:15](https://github.com/phonowell/fire-keeper/blob/main/src/toDate.ts#L15)

Convert input to Date object. Handles various formats and validates results.

## Parameters

### input

Date object, timestamp (number), or date string

`string` | `number` | `Date`

## Returns

`Date`

A valid Date object after 1970-01-01

## Throws

Error when input is invalid or results in date before epoch

## Example

```
toDate(new Date())        // Current date
toDate(1640995200000)     // 2022-01-01
toDate('2021-01-01')      // Hyphenated format
toDate('2021/01/01')      // Slash format
toDate('2021-01-01T12:00:00Z') // ISO format
```
