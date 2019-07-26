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

import { wrap } from "../../helpers";

export const testWrap = ({ wrapWith, paramNames, expected }: ITestDataWrap, caseNum?: number) => {
  const num = caseNum !== undefined ? `(#${caseNum}): ` : "";
  describe(`${num}given wrapWith: [${wrapWith}], and paraNames: [${paramNames}]`, () => {
    it(`should return an object equalling: ${expected}`, () => {
      expect(wrap(wrapWith, paramNames)).toEqual(expected);
    });
  });
};

export const testWrapThrows = ({ wrapWith, paramNames }: ITestDataWrapThrows, caseNum?: number) => {
  const num = caseNum !== undefined ? `(#${caseNum}): ` : "";
  describe(`${num}given wrapWith: [${wrapWith}], and paraNames: [${paramNames}]`, () => {
    it(`should throw: RangeError`, () => {
      expect(() => {
        wrap(wrapWith, paramNames);
      }).toThrow(RangeError);
    });
  });
};

export interface ITestDataWrap {
  wrapWith: any[];
  paramNames: string[];
  expected: IWrapResult;
}

export interface ITestDataWrapThrows {
  wrapWith: any[];
  paramNames: string[];
}

interface IWrapResult {
  [key: string]: any;
}
