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

import * as helpers from "../../helpers/params";

describe("parse()", () => {
  describe("for mixed arg types", () => {
    [
      // #0 - all four - vanilla args (with and without default value), array and object destructuring
      {
        expected: ["a", "b", "c", "v"],
        input: "function fn(a = 1, [ b ], { c }, v) {}",
      },
      // #1 - all of the above, with callback
      {
        expected: ["a", "b", "c", "v"],
        input: "function fn(a = () => undefined, [ b ], { c }, v) {}",
      },
      // #2 - all of the above with callback args
      {
        expected: ["a", "b", "c", "v"],
        input: "function fn(a = (x, y, z) => undefined, [ b ], { c }, v) {}",
      },
      // #3 - all of the above with callback as callback args
      {
        expected: ["a", "b", "c", "v"],
        input: "function fn(a = (x, y = () => undefined, z) => undefined, [ b ], { c }, v) {}",
      },
      // #4 - all of the above, with nested array destructuring
      {
        expected: ["a", "b", "c", "d", "v"],
        input:
          "function fn(a = (x, y = () => undefined, z) => undefined, [ b, [ d ] ], { c }, v) {}",
      },
      // #5 - all of the above, with nested object and array destructuring
      {
        expected: ["a", "b", "d", "e", "v"],
        input:
          "function fn(a = (x, y = () => undefined, z) => undefined, [ b, [ d ] ], { c: { e } }, v) {}",
      },
      // #6 - all of the above, with multiple levels of nested object and array destructuring
      {
        expected: ["a", "b", "d", "f", "g", "i", "v"],
        input:
          "function fn(a = (x, y = () => undefined, z) => undefined, [ b, [ d, [ f, [ g ] ] ] ], { c: { e: { h: { i } } } }, v) {}",
      },
      // #7 - all of the above, with destructured default args
      {
        expected: ["a", "b", "d", "f", "g", "i", "v"],
        input:
          "function fn(a = (x, y = () => undefined, z) => undefined, [ b, [ d, [ f = 2, [ g = 1 ] = [] ] = [] ] ], { c: { e: { h: { i = 3 } = {} } } }, v) {}",
      },
    ].forEach(helpers.testInputOutput);
  });
});
