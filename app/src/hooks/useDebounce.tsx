import { useRef } from "react";

export const useDebounce = (callback: () => (Promise<void> | void), ms: number) => {
    const debounceRef = useRef<NodeJS.Timeout>();

    const callDebouncedMethod = () => {
        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(callback, ms);
    };

    return callDebouncedMethod;
};