# use-localstorage2

[![NPM version](https://img.shields.io/npm/v/use-localstorage2.svg)](https://www.npmjs.com/package/use-localstorage2)
[![NPM monthly download](https://img.shields.io/npm/dm/use-localstorage2.svg)](https://www.npmjs.com/package/use-localstorage2)

> React side-effect hook that manages a single localStorage key.

## Installation

To install the stable version:

```sh
$ yarn add use-localstorage2
```

## Usage

```jsx
import {useLocalStorage} from 'use-localstorage2';

const App = () => {
  const [value, setValue, remove] = useLocalStorage('my-key', 'foo');

  return (
    <div>
      <div>Value: {value}</div>
      <button onClick={() => setValue('bar')}>bar</button>
      <button onClick={() => setValue('baz')}>baz</button>
      <button onClick={() => remove()}>Remove</button>
    </div>
  );
};
```

## Reference

```ts
useLocalStorage(key);
useLocalStorage(key, initialValue);
useLocalStorage(key, initialValue, {raw: true});
useLocalStorage(key, initialValue, {
  raw: false,
  serializer: (value: T) => string,
  deserializer: (value: string) => T,
});
```

- `key` &mdash; `localStorage` key to manage.
- `initialValue` &mdash; initial value to set, if value in `localStorage` is empty.
- `raw` &mdash; boolean, if set to `true`, hook will not attempt to JSON serialize stored values.
- `serializer` &mdash; custom serializer (defaults to `JSON.stringify`)
- `deserializer` &mdash; custom deserializer (defaults to `JSON.parse`)

## License

MIT
