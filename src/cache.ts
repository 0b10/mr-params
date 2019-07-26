//
// MIT License
//
// Copyright (c) 2019 0b10
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
//

/**
 * A closure containing a cache object, which returns operations.
 * @param debug - A boolean, set to true to throw a CacheDebugError for debugging purposes. See contained
 *  function doc comments for more details.
 * @returns { get, put } // get(k: string), put(k: string, v: string[])
 */
export default (debug = false): ICacheOps => {
  const cache: ICache = {};

  /**
   * Get a cache item given a key.
   * @param key - A string, the lookup key.
   * @returns false if the key doesn't exist, an array of strings otherwise.
   * @example get("foo") // => ["a", "b", "c"]
   */
  const get = (key: string): false | string[] | undefined => {
    const result = cache[key];
    return result;
  };

  /**
   * Insert a cache item. This function makes no prior checks for key existence, and will overwrite
   *  any existing value. It is assumed that you have attempted to get(), or has() first.
   * @param key - A string, the lookup key.
   * @param val - Am array of strings, the value that has been cached.
   * @example put("foo", ["a", "b", "c"]) // => undefined
   * @throws CacheDebugError if debug === true, and the key already exists in the cache.
   */
  const put = (key: string, val: string[] | false) => {
    if (debug && cache[key] !== undefined) {
      throw new CacheDebugError(
        `The key already exists in the cache: k:'${key}', v:'${cache[key]}'`,
      );
    }
    cache[key] = val;
  };

  return { get, put };
};

// >>> ERRORS >>>
export class CacheDebugError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CacheError";
  }
}

// >>> INTERFACES >>>
interface ICache {
  [key: string]: string[] | false;
}

export interface ICacheOps {
  get: (key: string) => string[] | false | undefined;
  put: (key: string, val: string[] | false) => void;
}
