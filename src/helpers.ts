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

export const wrap = (wrapWith: any[], paramNames: string[]): IWrapper => {
  if (wrapWith.length !== paramNames.length) {
    // paramNames as string[] has a guard
    throw new RangeError(
      `wrapWith.length (${wrapWith.length}) should match the number of returned parameters (${
        (paramNames as string[]).length
      }), cannot wrap`,
    );
  }
  const wrapper: IWrapper = {};
  wrapWith.forEach((value: any, index: number) => {
    const key = paramNames[index];
    wrapper[key] = value;
  });
  return wrapper;
};

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
export const checkCache = (
  cache: boolean,
  key: string,
  get: (key: string) => false | string[] | undefined,
  wrapWith: any[],
): false | undefined | IWrapper => {
  if (cache) {
    const cacheHit = get(key);
    if (cacheHit) {
      // +++ wrapped +++
      if (wrapWith.length > 0 && cacheHit) {
        return wrap(wrapWith, cacheHit as string[]); // cacheHit will be arr len > 0
      }
      // +++ not wrapped +++
      return cacheHit; // will return false or string[]
    } else if (cacheHit === false) {
      // Values can be explicit false (parse(): no args), return it to avoid the AST generation below.
      return cacheHit;
    }
    // cacheHit undefined (miss) should fall through here
  }
};

export interface IWrapper {
  [key: string]: any;
}
