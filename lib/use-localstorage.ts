import {useState, useCallback, useMemo, Dispatch, SetStateAction} from 'react';

import {isBrowser, noop} from './utils';
import {LocalstorageParserOptions} from './types';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: LocalstorageParserOptions<T>
): [T, Dispatch<SetStateAction<T>>, () => void];

export function useLocalStorage<T>(
  key: string,
  initialValue?: T,
  options?: LocalstorageParserOptions<T>
): [T | undefined, Dispatch<SetStateAction<T>>, () => void];

export function useLocalStorage<T>(
  key: string,
  initialValue?: T,
  options?: LocalstorageParserOptions<T>
): [T | undefined, Dispatch<SetStateAction<T>>, () => void] {
  if (!isBrowser) {
    return [initialValue as T, noop, noop];
  }
  if (!key) {
    throw new Error('useLocalStorage key may not be falsy');
  }

  const deserializer = useMemo(
    () =>
      options
        ? options.raw
          ? (value: string) => value
          : options.deserializer
        : JSON.parse,
    [options]
  );

  const serializer = useMemo(
    () =>
      options
        ? options.raw
          ? (value: unknown) =>
              typeof value === 'string' ? value : JSON.stringify(value)
          : options.serializer
        : JSON.stringify,
    [options]
  );

  const [state, setState] = useState<T | undefined>(() => {
    try {
      const localStorageValue = localStorage.getItem(key);
      if (localStorageValue !== null) {
        return deserializer(localStorageValue);
      } else {
        initialValue && localStorage.setItem(key, serializer(initialValue));
        return initialValue;
      }
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue;
    }
  });

  const set: Dispatch<SetStateAction<T>> = useCallback(
    valOrFunc => {
      setState(prevState => {
        const newState =
          typeof valOrFunc === 'function'
            ? (valOrFunc as Function)(prevState)
            : valOrFunc;
        if (typeof newState === 'undefined') return;

        try {
          const value = serializer(newState);

          localStorage.setItem(key, value);
          return deserializer(value);
        } catch {
          // If user is in private mode or has storage restriction
          // localStorage can throw. Also JSON.stringify can throw.
          return prevState;
        }
      });
    },
    [key, serializer, deserializer]
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setState(initialValue);
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw.
    }
  }, [initialValue, key]);

  return [state, set, remove];
}
