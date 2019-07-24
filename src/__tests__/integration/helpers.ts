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

import compose, { IOptions } from "../../";

// >>> HELPERS >>>
/**
 * Sort an array in ascending order, typically an array of strings.
 * @param arr - The array to sort, each item must be comparible with comparison operators - i.e: <
 * @example sortAsc(["c", "b", "a"]);  // => ["a", "b", "c"]
 */
export const sortAsc = (arr: string[]): string[] => arr.sort((a, b) => (a < b ? -1 : 1));

const composeFactory = (options: IOptions | undefined = {}) => compose(options);

// >>> TEST LOGIC >>>
export const testInputOutput = ({ input, expected, options }: ITestDataRoot, caseNum: number) => {
  describe(`(#${caseNum}): input: '${input}'`, () => {
    it(`should return an unordered array of strings, containing only: ${expected}`, () => {
      const sortedParamNames = sortAsc(composeFactory(options)(input) as any); // this won't be given a boolean
      const sortedExpected = sortAsc(expected);
      expect(sortedParamNames).toEqual(sortedExpected);
      expect(sortedParamNames.length).toBe(sortedExpected.length);
    });
  });
};

// >>> INTERFACES >>>
interface ITestDataRoot {
  input: (...args: any[]) => any;
  expected: string[];
  options?: IOptions;
}
