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

// tslint:disable:no-unused-expression

import { Params } from "../../../params";

describe("Unit Tests: params - vanilla params", () => {
  describe("parse()", () => {
    it("return false when there's no params", () => {
      expect(new Params("() => undefined").parse()).toBe(false);
    });

    [
      {
        expected: ["a"],
        input: "(a) => undefined",
      },
      {
        expected: ["a", "b"],
        input: "(a, b) => undefined",
      },
      {
        expected: ["a", "b", "c"],
        input: "(a, b, c) => undefined",
      },
      {
        expected: ["a"],
        input: "function fn(a) { return undefined }",
      },
      {
        expected: ["a", "b"],
        input: "function fn(a, b) { return undefined }",
      },
      {
        expected: ["a", "b", "c"],
        input: "function fn(a, b, c) { return undefined }",
      },
      // ! Don't test function() {} <-- anonymous. This is transformed by a regex preprocessor
    ].forEach(({ input, expected }, caseNum) => {
      describe(`(#${caseNum}): given the string of a function: '${input}'`, () => {
        it(`should return an array of strings: ["${expected}"]`, () => {
          expect(new Params(input).parse()).toEqual(expected);
        });
      });
    });
  });
});
