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

import { testInputOutput } from "./helpers";

describe("Unit Tests: params - order", () => {
  describe("parse()", () => {
    [
      // #0 - simple
      {
        expected: ["b", "a"],
        input: "(b, a) => { }",
      },
      // #1 - many
      {
        expected: ["b", "a", "k", "h", "u", "s", "g", "t"],
        input: "(b, a, k, h, u, s, g, t) => { }",
      },
      // #2 - destructured objects
      {
        expected: ["b", "a", "k", "h", "u", "s", "g", "t"],
        input: "(b, a, {k}, h, {u}, {s}, g, t) => { }",
      },
      // #3 - nested destructured objects
      {
        expected: ["b", "a", "v", "h", "x", "l", "j", "g", "t"],
        input: "(b, a, {k: {p: {v}}}, h, {u: {x}}, {s: {w: {l}, j}}, g, t) => { }",
      },
      // #4 - nested destructured objects, and arrays
      {
        expected: ["b", "bb", "bbb", "a", "v", "h", "hh", "hhh", "x", "l", "j", "g", "t"],
        input:
          "([b, [bb, [bbb]]], a, {k: {p: {v}}}, [h, [hh, [hhh]]], {u: {x}}, {s: {w: {l}, j}}, g, t) => { }",
      },
      // #5 - destructuring with defaults
      {
        expected: ["z", "f", "ff", "ccc"],
        input: "(z = 1, [f = 1, [ff = 1]] = [], {c: {cc: {ccc = 1}}} = {}) => { }",
      },
      // #6 - with comments
      {
        expected: ["f", "r", "s", "u"],
        input: "(f, r, /*)comment*/ s, //)comment\n u) => { }",
      },
    ].forEach(testInputOutput);
  });
});
