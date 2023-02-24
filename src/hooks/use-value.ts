import { useRef } from 'react';

export function useValue<T>(value: T) {
    const cache = useRef(value);
    return cache.current;
}
