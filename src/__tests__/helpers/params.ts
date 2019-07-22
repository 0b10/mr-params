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

import { parse } from "../../params";

// >>> HELPERS >>>
/**
 * Sort an array in ascending order, typically an array of strings.
 * @param arr - The array to sort, each item must be comparible with comparison operators - i.e: <
 * @example sortAsc(["c", "b", "a"]);  // => ["a", "b", "c"]
 */
export const sortAsc = (arr: string[]): string[] => arr.sort((a, b) => (a < b ? -1 : 1));

// >>> TESTING LOGIC >>>
/**
 * Test that the return value from parse() is an expected value. Both the result from parse() and
 *  the expected array are sorted before comparison - so order doesn't matter.
 * @param param0 - An object: { input, expected }, where input is a funcString, and expected is an
 *  unordered array of all symbols (as strings) expected to be returned from parse.
 * @param caseNum - the test case number, this is injected by forEach
 * @example
 * [
 *  {
 *    expected: ["b", "c", "a"] // any order
 *    input: "(a, b, c) => undefined"
 *  }
 * ].forEach(testInputOutput) // Second arg is index: forEach({...}, index)
 */
export const testInputOutput = ({ input, expected }: ITestData, caseNum: number) => {
  describe(`(#${caseNum}): input: '${input}'`, () => {
    it(`should return an unordered array of strings, containing only: ${expected}`, () => {
      // The array will be unordered, so sort first
      const sortedParamNames = sortAsc(parse(input) as string[]); // parse() shouldn't return boolean
      const sortedExpected = sortAsc(expected);
      expect(sortedParamNames.length).toBe(sortedExpected.length);
      expect(sortedParamNames).toEqual(sortedExpected);
    });
  });
};

// >>> INTERFACES >>>
export interface ITestData {
  input: string;
  expected: string[];
}
