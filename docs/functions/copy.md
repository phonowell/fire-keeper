[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / copy

# Function: copy()

> **copy**(`source`, `target`?, `options`?): `Promise`\<`void`\>

Defined in: [copy.ts:77](https://github.com/phonowell/fire-keeper/blob/main/src/copy.ts#L77)

Copy files or directories with support for concurrent operations and flexible naming.

## Parameters

### source

Source file(s) or directory path(s)
                Can be a single string path or array of paths
                Supports glob patterns

`string` | `string`[]

### target?

`Dirname`

(Optional) Target directory or path transformation function
                - If undefined: Copy to same directory with '.copy' suffix
                - If string: Copy to specified directory path
                - If function: Dynamic path generation based on source dirname

### options?

(Optional) Copy configuration
                Can be either a string (new filename) or an options object
                - If string: Used as the new filename
                - If object: Supports following properties:
                  - filename: New filename or function to generate filename
                  - concurrency: Number of concurrent copy operations (default: 5)

`Dirname` | `Options`

## Returns

`Promise`\<`void`\>

Promise<void> Resolves when all copy operations complete

## Throws

When source file doesn't exist or copy operation fails

## Examples

```ts
await copy('source.txt');  // Creates source.copy.txt
```

```ts
await copy(['file1.txt', 'file2.txt'], 'backup');
```

```ts
await copy('file.txt', 'backup', 'newname.txt');
```

```ts
await copy('file.txt', dirname => `backup/${dirname}`);
```

```ts
await copy('file.txt', 'backup', {
  filename: name => `${name}-${Date.now()}`,
  concurrency: 3
});
```

```ts
await copy('src/*.js', 'dist');
```
