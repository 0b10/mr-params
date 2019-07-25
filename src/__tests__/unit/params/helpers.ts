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

import { parse } from "../../../params";
import { ITestDataIO } from "../../interfaces";

// >>> TESTING LOGIC >>>
/**
 * Test that the return value from parse() is an expected value - order matters
 * @param param0 - An object: { input, expected }, where input is a funcString, and expected is an
 *  ordered array of all symbols (as strings) expected to be returned from parse.
 * @param caseNum - the test case number, this is injected by forEach
 * @example
 * [
 *  {
 *    expected: ["a", "b", "c"]  // order matters
 *    input: "(a, b, c) => undefined"
 *  }
 * ].forEach(testInputOutput) // Second arg is index: forEach({...}, index)
 */
export const testInputOutput = ({ input, expected }: ITestDataIO, caseNum: number) => {
  describe(`(#${caseNum}): input: '${input}'`, () => {
    it(`should return an ordered array of strings, containing exactly: ${expected}`, () => {
      const result = parse(input) as string[]; // parse() shouldn't return boolean here, so 'as string[]'
      expect(result).toEqual(expected);
      expect(result.length).toBe(expected.length);
    });
  });
};
