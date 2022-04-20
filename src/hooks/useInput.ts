import React, { useCallback, useState } from 'react';

type ReturnType<T> = [
    T,
    (e: any) => void,
    React.Dispatch<React.SetStateAction<T>>
];

/**
 * form-input 처리하는 hook.
 * @param initial 초기값
 */
export default function useInput<T>(initial: T): ReturnType<T> {
    const [value, setValue] = useState(initial);
    const onChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value as unknown as T);
    }, []);
    return [value, onChanged, setValue];
}
