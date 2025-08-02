import camelcaseKeys from 'camelcase-keys';

export function toCamel<T extends object>(obj: unknown): T | undefined {
    if (!obj || typeof obj !== 'object') return undefined;
    return camelcaseKeys(obj as Record<string, unknown>, { deep: true }) as T;
}

export function toCamelArray<T extends object>(arr: unknown): T[] | undefined {
    if (!Array.isArray(arr)) return undefined;
    return camelcaseKeys(arr as Record<string, unknown>[], {
        deep: true,
    }) as T[];
}
