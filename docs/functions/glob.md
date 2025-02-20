[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / glob

# Function: glob()

> **glob**(`input`, `options`?): `Promise`\<`ListSource`\>

Defined in: [glob.ts:50](https://github.com/phonowell/fire-keeper/blob/862cc844119f7a539be35ffaeee5bfb3fdb4b3cd/src/glob.ts#L50)

List files or directories using glob patterns.

## Parameters

### input

Glob pattern(s) to match files or directories

`string` | `string`[] | `ListSource`

### options?

`Options`

Additional options for glob matching

## Returns

`Promise`\<`ListSource`\>

A promise that resolves to an array of matched paths

## Example

```typescript
// Basic usage with single pattern
const list = await glob('*.txt');
console.log(list);
//=> ['a.txt', 'b.txt']

// Multiple patterns
const files = await glob(['src/*.ts', '!src/*.test.ts']);
//=> ['src/index.ts', 'src/utils/helper.ts']

// With options
const docs = await glob('docs/*', {
  absolute: true,
  dot: true
});
//=> ['/absolute/path/docs/readme.md']

// Empty or invalid input
const empty = await glob('');
//=> []
```
