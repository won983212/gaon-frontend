import React, { useCallback, useState } from 'react';

type ReturnType<T> = [
    T,
    (e: any) => void,
    React.Dispatch<React.SetStateAction<T>>
];

export default function useInput<T>(initial: T): ReturnType<T> {
    const [value, setValue] = useState(initial);
    const onChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value as unknown as T);
    }, []);
    return [value, onChanged, setValue];
}
