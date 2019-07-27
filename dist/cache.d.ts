declare const _default: (debug?: boolean) => ICacheOps;
/**
 * A closure containing a cache object, which returns operations.
 * @param debug - A boolean, set to true to throw a CacheDebugError for debugging purposes. See contained
 *  function doc comments for more details.
 * @returns { get, put } // get(k: string), put(k: string, v: string[])
 */
export default _default;
export declare class CacheDebugError extends Error {
    constructor(message: string);
}
export interface ICacheOps {
    get: (key: string) => string[] | false | undefined;
    put: (key: string, val: string[] | false) => void;
}
