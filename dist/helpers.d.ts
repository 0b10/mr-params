export declare const wrap: (wrapWith: any[], paramNames: string[]) => IWrapper;
/**
 * A helper function to clean up the logic in the main function.
 * @param cache - A boolean, enabled or disabled.
 * @param key - The lookup key.
 * @param get - The cache lookup function.
 * @param wrapWith - an array of values to wrap the results with.
 * @returns undefined if the loookup was unsuccessful, or string[]|false are valid cache hit values to be
 *  returned. You must explicitly check for undefined for a cache miss.
 * @example
 * const result = checkCache(true, "(a) => undefined", get, [1])
 * if (result !== undefined) {
 *  return result;
 * } // => {a: 1}
 */
export declare const checkCache: (cache: boolean, key: string, get: (key: string) => false | string[] | undefined, wrapWith: any[]) => false | IWrapper | undefined;
export interface IWrapper {
    [key: string]: any;
}
