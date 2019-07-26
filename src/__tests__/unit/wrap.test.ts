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

import { testWrap, testWrapThrows } from "./helpers";

describe("Unit Tests: helpers (root)", () => {
  describe("wrap()", () => {
    // >>> TYPICAL CASES >>>
    describe(">>> successfull cases", () => {
      [
        // #0 - zero args
        {
          expected: {},
          paramNames: [],
          wrapWith: [],
        },
        // #1 - single arg
        {
          expected: { a: 1 },
          paramNames: ["a"],
          wrapWith: [1],
        },
        // #2 - multiple args
        {
          expected: { a: 1, b: 2, c: 3 },
          paramNames: ["a", "b", "c"],
          wrapWith: [1, 2, 3],
        },
        // #3 - mixed types
        {
          expected: { f: "a", g: 2, b: /foo/ },
          paramNames: ["f", "g", "b"],
          wrapWith: ["a", 2, /foo/],
        },
      ].forEach(testWrap);
    });

    // >>> EXCEPTIONAL CASES >>>
    describe(">>> exceptional cases", () => {
      [
        // #0 - extra param name
        {
          paramNames: ["a"],
          wrapWith: [],
        },
        // #0 - extra wrapWith
        {
          paramNames: [],
          wrapWith: [1],
        },
        // #2 - man more param names, with some wrapWith
        {
          paramNames: ["a", "z", "g", "n", "x", "r", "o"],
          wrapWith: [1, 2, 3],
        },
        // #2 - man more param names, with some wrapWith
        {
          paramNames: ["a", "z", "g"],
          wrapWith: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        },
      ].forEach(testWrapThrows);
    });
  });
});
