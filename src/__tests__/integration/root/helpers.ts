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

import compose, { IOptions } from "../../..";
import { IWrapper } from "../../../helpers";

// >>> HELPERS >>>
// Disable cache by default to avoid any potential issues in other tests
export const composeFactory = (options: IOptions | undefined = { cache: false, debug: false }) =>
  compose(options);

/**
 * Create a cacheFactory, suitable for injecting into the root factory. You can control whether there's
 *  a cache hit, or miss. This wil invoke different logic within the root logic, meaning you can test
 *  whether get() and put() are called based on a cache hit.
 * @param cacheHit - determine whether there's a cache hit or not.
 * @returns a cacheFactory, that returns the following mocks { mockGet, mockPut, mockCacheFactory }. These
 *  mocks  can be used to spy on get and put calls.
 * @example
 * const { mockGet, mockPut, mockCacheFactory } = makeCacheFactory(true);
 * const parse = rootFactory({ cacheFactory: mockCacheFactory });
 * parse(...)
 * expect(mockGet.mock.calls.length)...
 */
export const makeCacheFactory = (cacheHit: boolean) => {
  const mockGet = jest.fn(() => (cacheHit ? ["a"] : undefined)); // must be undefined for cache miss
  const mockPut = jest.fn(() => undefined);

  const mockCacheFactory = jest.fn(() => {
    return { get: mockGet, put: mockPut };
  });

  return { mockCacheFactory, mockGet, mockPut };
};

// >>> TEST LOGIC >>>
export const testInputOutput = (
  { input: { funcRef, wrapWith }, expected, options }: ITestDataRoot,
  caseNum: number,
) => {
  describe(`(#${caseNum}): given funcRef: '${funcRef}, wrapWith: ${wrapWith}, and options: ${options}'`, () => {
    it(`should return an ordered array of strings, containing only: ${expected.toString()}`, () => {
      const result = composeFactory(options)(funcRef, wrapWith) as any;
      expect(result).toEqual(expected);
    });
  });
};

export const testWrapStateChange = (
  {
    expectedAfter,
    expectedBefore,
    funcRef,
    wrapWithAfter,
    wrapWithBefore,
    options,
  }: ITestDataWrapStateChange,
  caseNum: number,
) => {
  describe(`(#${caseNum}): given the following args: ${{
    expectedAfter,
    expectedBefore,
    funcRef,
    options,
    wrapWithAfter,
    wrapWithBefore,
  }}'`, () => {
    it(`should wrap results even if they have been cached. Expected: ${{
      expectedAfter,
      expectedBefore,
    }}`, () => {
      const parse = composeFactory(options);
      const resultBefore = parse(funcRef, wrapWithBefore);
      const resultAfter = parse(funcRef, wrapWithAfter);

      expect(resultBefore).toEqual(expectedBefore);
      expect(resultAfter).toEqual(expectedAfter);
    });
  });
};

/**
 * Test the cache is used as expected by checking calls made to mock replacements.
 * @param testData - An object (ICacheTestData), that holds the test data,
 * @param caseNum - the test case number. Typically this is injected by a forEach loop. It's optional
 * @example testCache({ cacheEnabled: true, cacheHit: true, getCalls: 1, putCalls: 0 }, 0)
 * @example [{...}: ICacheData].forEach(testCache)
 */
export const testCache = (
  { cacheEnabled, cacheHit, getCalls, putCalls, wrapWith }: ICacheTestData,
  caseNum?: number,
) => {
  const num = caseNum !== undefined ? "(#" + caseNum + "): " : ""; // '(#num): ' or ""
  describe(`${num}when the cache is ${cacheEnabled ? "enabled" : "disabled"} and there's a cache ${
    cacheHit ? "hit" : "miss"
  }`, () => {
    it(`should call get() ${getCalls} times and put() ${putCalls} times`, () => {
      const { mockCacheFactory, mockGet, mockPut } = makeCacheFactory(cacheHit);
      const parse = compose({
        cache: cacheEnabled,
        cacheFactory: mockCacheFactory,
        debug: true,
      });
      parse((a) => undefined, wrapWith ? ["a"] : undefined);
      expect(mockGet.mock.calls.length).toBe(getCalls);
      expect(mockPut.mock.calls.length).toBe(putCalls);
    });
  });
};

// >>> INTERFACES >>>
interface ITestDataRoot {
  input: IParseArgs;
  expected: string[] | IWrapper;
  options?: IOptions;
}

interface ICacheTestData {
  cacheEnabled?: boolean;
  cacheHit: boolean;
  getCalls: number;
  putCalls: number;
  wrapWith?: boolean;
}

interface IParseArgs {
  funcRef: (...args: any[]) => any;
  wrapWith?: any[];
}

interface ITestDataWrapStateChange {
  funcRef: (...args: any[]) => any;
  wrapWithAfter: any[] | undefined;
  wrapWithBefore: any[] | undefined;
  expectedAfter: IWrapper | string[] | boolean;
  expectedBefore: IWrapper | string[] | boolean;
  options: IOptions;
}
