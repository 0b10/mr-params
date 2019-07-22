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

import { parse } from "../../../params";
import * as helpers from "../../helpers/params";

describe("Unit Tests: params - destructured params", () => {
  describe("parse()", () => {
    // >>> OBJECT DESTRUCTURING >>>
    describe(">>> Object destructuring", () => {
      [
        // ~~~ Simple ~~~
        {
          // #0
          expected: ["a"],
          input: "function fn({ a }) { }",
        },
        {
          // #1
          expected: ["a", "b"],
          input: "function fn({ a, b }) { }",
        },
        {
          // #2
          expected: ["a", "b", "c"],
          input: "function fn({ a, b, c }) { }",
        },
        // ~~~ Nested ~~~
        {
          // #3
          expected: ["b"],
          input: "function fn({ a: { b } }) { }",
        },
        {
          // #4
          expected: ["c"],
          input: "function fn({ a: { b: { c } } }) { }",
        },
        {
          // #5
          expected: ["c", "d", "e"],
          input: "function fn({ a: { b: { c }, d }, e }) { }",
        },
        {
          // #6
          expected: ["c", "f", "h"],
          input: "function fn({ a: { b: { c }, d: { e: { f } } }, g: { h } }) { }",
        },
        {
          // #7
          expected: ["c", "e", "j", "k", "l"],
          input: "function fn({ a: { b: { c }, d: { e }, f: { h: { i: { j }, k }, l } } }) { }",
        },
        {
          // #8
          expected: ["c", "e", "j", "k", "l"],
          input: "({ a: { b: { c }, d: { e }, f: { h: { i: { j }, k }, l } } }) => undefined",
        },
        // ~~~ Multiple Params ~~~
        {
          // #9
          expected: ["a", "b"],
          input: "function fn({ a }, { b }) { }",
        },
        {
          // #10
          expected: ["a", "b", "c"],
          input: "function fn({ a }, { b }, { c }) { }",
        },
        {
          // #11
          expected: ["b", "d", "h"],
          input: "function fn({a:{ b }}, {c:{ d }}, {e:{f:{g:{ h }}}}) { }",
        },
        // ! Don't test function() {} <-- anonymous. This is transformed by a regex preprocessor
      ].forEach(helpers.testInputOutput);
    });

    // >>> ARRAY DESTRUCTURING >>>
    describe(">>> Array destructuring", () => {
      [
        // ~~~ Simple ~~~
        {
          // #0
          expected: ["a"],
          input: "function fn([ a ]) { }",
        },
        {
          // #1
          expected: ["a", "b"],
          input: "function fn([ a, b ]) { }",
        },
        {
          // #2
          expected: ["a", "b", "c"],
          input: "function fn([ a, b, c ]) { }",
        },
        // ~~~ Nested ~~~
        {
          // #3
          expected: ["a", "b"],
          input: "function fn([ a, [ b ] ]) { }",
        },
        {
          // #4
          expected: ["a", "b", "c"],
          input: "function fn([ a, [ b, [ c ] ] ]) { }",
        },
        {
          // #5
          expected: ["a", "b", "c", "d"],
          input: "function fn([ a, [ b, [ c, [ d ] ] ] ]) { }",
        },
        {
          // #6
          expected: ["a", "b", "c", "d", "e"],
          input: "function fn([ a, [ b, [ c, [ d ], [ e ] ] ] ]) { }",
        },
        {
          // #7
          expected: ["a", "b", "c", "d", "e", "f", "g"],
          input: "function fn([ a, [ b, [ c, [ d ], [ e ] ], [ f, [ g ] ] ] ]) { }",
        },
        {
          // #8
          expected: ["a", "b", "c", "d", "e", "f", "g", "h"],
          input: "function fn([ a, [ b, [ c, [ d ], [ e ] ], [ f, [ g, [ h ] ] ] ] ]) { }",
        },
        {
          // #9
          expected: ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
          input: "function fn([ a, [ b, [ c, [ d ], [ e ] ], [ f, [ g, [ h ] ] ], [ i ] ] ]) { }",
        },
        // ~~~ Multiple Params ~~~
        {
          // #10
          expected: ["a", "b"],
          input: "function fn([ a ], [ b ]) { }",
        },
        {
          // #11
          expected: ["a", "b", "c"],
          input: "function fn([ a, b ], [ c ]) { }",
        },
        {
          // #12
          expected: ["a", "b", "c", "d", "e"],
          input: "function fn([ a, b ], [ c ], [ d, e ]) { }",
        },
        {
          // #13
          expected: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"],
          input: "function fn([ a, [ b ] ], [ c ], [ d, [ e, [ f, [ g, [ h, i], j ] ] ], k ]) { }",
        },
        // ! Don't test function() {} <-- anonymous. This is transformed by a regex preprocessor
      ].forEach(helpers.testInputOutput);
    });
  });
});
