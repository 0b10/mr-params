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
// tslint:disable:max-line-length

import { parse } from "../../../params";

describe("Unit Tests: params - default args", () => {
  // >>> HELPERS >>>
  const sortAlpha = (arr: string[]): string[] => arr.sort((a, b) => (a < b ? -1 : 1));

  // >>> TESTING LOGIC >>>
  const doTest = ({ input, expected }: ITestData, caseNum: number) => {
    describe(`(#${caseNum}): input: '${input}'`, () => {
      it(`should return an unordered array of strings, containing exactly: ${expected}`, () => {
        // The array will be unordered, so sort first
        const sortedParamNames = sortAlpha(parse(input) as string[]); // parse() shouldn't return boolean
        const sortedExpected = sortAlpha(expected);
        expect(sortedParamNames.length).toBe(sortedExpected.length);
        expect(sortedParamNames).toEqual(sortedExpected);
      });
    });
  };
  // >>> Primitives >>>
  describe("parse()", () => {
    describe("for primitive default args types", () => {
      [
        // #0 - single
        {
          expected: ["a"],
          input: "function fn(a = 1) {}",
        },
        // #1 - double
        {
          expected: ["a", "b"],
          input: "function fn(a = 1, b = 2) {}",
        },
        // #2 - left and right
        {
          expected: ["a", "b", "c"],
          input: "function fn(a = 1, b, c = 2) {}",
        },
        // #2 - middle
        {
          expected: ["a", "b", "c"],
          input: "function fn(a, b = 1, c) {}",
        },
      ].forEach(doTest);
    });

    // >>> Functions >>>
    describe("for callbacks as default args", () => {
      // ~~~ No args (inside callback) ~~~
      describe("where callbacks have no args", () => {
        [
          // #0 - single
          {
            expected: ["a"],
            input: "(a = () => undefined) => undefined",
          },
          // #1 - right
          {
            expected: ["a", "b"],
            input: "(a, b = () => undefined) => undefined",
          },
          // #2 - middle
          {
            expected: ["a", "b", "c"],
            input: "(a, b = () => undefined, c) => undefined",
          },
          // #3 - right x3
          {
            expected: ["a", "b", "c"],
            input: "(a, b, c = () => undefined ) => undefined",
          },
          // #4 - normie func single
          {
            expected: ["a", "b", "c"],
            input: "function fn(a = function() {}, b, c) {}",
          },
          // #5 - normie func middle
          {
            expected: ["a", "b", "c"],
            input: "function fn(a, b = function() {}, c) {}",
          },
          // #6 - normie funcright
          {
            expected: ["a", "b", "c"],
            input: "function fn(a, b, c = function() {}) {}",
          },
        ].forEach(doTest);
      });

      // ~~~ With Args (inside callback) ~~~
      describe("where callbacks have args", () => {
        [
          // #0 - left
          {
            expected: ["a"],
            input: "function fn(a = () => undefined) {}",
          },
          // #1 - right
          {
            expected: ["a", "b"],
            input: "function fn(a, b = (x, y, z) => undefined) {}",
          },
          // #2 - middle
          {
            expected: ["a", "b", "c"],
            input: "function fn(a, b = (x, y, z) => undefined, c) {}",
          },
          // #3 - right x3
          {
            expected: ["a", "b", "c"],
            input: "function fn(a, b, c = (x, y, z) => undefined ) {}",
          },
          // #4 - normie func left
          {
            expected: ["a", "b", "c"],
            input: "function fn(a = function(x, y, z) {}, b, c) {}",
          },
          // #5 - normie func middle
          {
            expected: ["a", "b", "c"],
            input: "function fn(a, b = function(x, y, z) {}, c) {}",
          },
          // #6 - normie func right
          {
            expected: ["a", "b", "c"],
            input: "function fn(a, b, c = function(x, y, z) {}) {}",
          },
        ].forEach(doTest);
      });

      // ~~~ Callback-ception ~~~
      describe("callback-ception: callback as default args in callbacks, that are default args ", () => {
        [
          // #0
          {
            expected: ["a", "b"],
            input:
              "function fn(a = (x = () => undefined, y, z = () => undefined) => undefined, b) {}",
          },
        ].forEach(doTest);
      });
    });

    describe("default values for destructured args", () => {
      [
        // #0 - single
        {
          expected: ["a"],
          input: "function fn({ a = 1 } = {}) {}",
        },
        // #1 - two in one
        {
          expected: ["a", "b"],
          input: "function fn({a = 1, b = 1} = {}) {}",
        },
        // #2 - multiple
        {
          expected: ["a", "b", "c"],
          input: "function fn({a = 1, b = 1} = {}, { c = 1 } = {}) {}",
        },
        // #2 - nested
        {
          expected: ["a", "c", "d"],
          input: "function fn({a = 1, b: { c = 1 } = {} } = {}, { d = 1 } = {}) {}",
        },
        // #3 - lost it
        {
          expected: ["a", "g", "i"],
          input:
            "function fn({a = 1, b: { c: { e : { f: { g = 1} = {} }} } = {} } = {}, { d: { h: { i = 1 } = {}} } = {}) {}",
        },
      ].forEach(doTest);
    });
  });
});

interface ITestData {
  input: string;
  expected: string[];
}
