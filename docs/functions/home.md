[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / home

# Function: home()

> **home**(): `string`

Defined in: [home.ts:21](https://github.com/phonowell/fire-keeper/blob/master/src/home.ts#L21)

Get the user's home directory with normalized forward slashes.

## Returns

`string`

The home directory path with forward slashes

## Example

```typescript
// On macOS/Linux
home();
//=> '/Users/username'

// On Windows (automatically converted to forward slashes)
home();
//=> 'C:/Users/username'

// Usage example
const configPath = `${home()}/.config/settings.json`;
//=> '/Users/username/.config/settings.json'
```
