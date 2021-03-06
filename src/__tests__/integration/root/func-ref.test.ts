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

// tslint:disable:arrow-parens
// tslint:disable:max-line-length
// tslint:disable:no-unused-expression
// tslint:disable:object-literal-shorthand
// tslint:disable:only-arrow-functions

import compose from "../../..";
import { testInputOutput } from "./helpers";

describe("Integration Tests: root", () => {
  describe("the inner function", () => {
    it("should function for a simple case", () => {
      expect(composeFactory()(() => undefined)).toBe(false);
    });

    // { input: { funcRef, wrapWith }, expected, options }
    describe("function types", () => {
      class MockClass {
        public mockMethod(a: any, b: any, c: any) {
          return undefined;
        }
        public async mockAsyncMethod(a: any) {
          return undefined;
        }
      }

      [
        // #0 - method
        {
          expected: ["a", "b", "c"],
          input: {
            funcRef: new MockClass().mockMethod,
          },
          options: {
            cache: false,
          },
        },
        // #1 - async method
        {
          expected: ["a"],
          input: {
            funcRef: new MockClass().mockAsyncMethod,
          },
          options: {
            cache: false,
          },
        },
        // #2 = function expression
        {
          expected: ["a", "b"],
          input: {
            funcRef: function(a: any, b: any) {
              return undefined;
            },
          },
          options: {
            cache: false,
          },
        },
        // #3 = async function expression
        {
          expected: ["a", "b"],
          input: {
            funcRef: async function(a: any, b: any) {
              return undefined;
            },
          },
          options: {
            cache: false,
          },
        },
        // #4 = arrow function
        {
          expected: ["a", "b"],
          input: {
            funcRef: (a: any, b: any) => {
              return undefined;
            },
          },
          options: {
            cache: false,
          },
        },
        // #5 = async arrow function
        {
          expected: ["a", "b", "c"],
          input: {
            funcRef: async (a: any, b: any, c: any) => {
              return undefined;
            },
          },
          options: {
            cache: false,
          },
        },
      ].forEach(testInputOutput);
    });

    // >>> Simple Args >>>
    describe(">>> simple args", () => {
      [
        // #0 - single arg
        {
          expected: ["a"],
          input: {
            funcRef: (a: any) => undefined,
          },
        },
        // #1 - body has symbol (in scope, and returned unless string is stripped)
        {
          expected: ["a"],
          input: {
            funcRef: (a: any) => {
              const b = 1;
              return b;
            },
          },
        },
        // #2 - multiple args
        {
          expected: ["a", "b", "c"],
          input: {
            funcRef: (a: any, b: any, c: any) => {
              const z = 1;
              return z;
            },
          },
        },
      ].forEach(testInputOutput);
    });

    // >>> Args With Callbacks >>>
    describe(">>> args with callbacks", () => {
      [
        // #0 - single callback
        {
          expected: ["a"],
          input: {
            funcRef: (a = (b: any, c: any, d: any) => undefined) => {
              const z = 1;
              return z;
            },
          },
        },
        // #1 - nested callback
        {
          expected: ["a"],
          input: {
            funcRef: (a = (b = (c: any) => undefined) => undefined) => {
              const z = 1;
              return z;
            },
          },
        },
        // #2 - multiple nested callbacks
        {
          expected: ["a", "d"],
          input: {
            funcRef: (
              a = (b = (c: any) => undefined) => undefined,
              d = (e = (f: any) => undefined) => undefined,
            ) => {
              const z = 1;
              return z;
            },
          },
        },
      ].forEach(testInputOutput);
    });

    // >>> Object Destructuring >>>
    describe(">>> object destructuring", () => {
      [
        // #0 - simple
        {
          expected: ["a"],
          input: {
            funcRef: ({ a }: any) => {
              const z = 1;
              return z;
            },
          },
        },
        // #1 - nested
        {
          expected: ["c"],
          input: {
            funcRef: ({
              a: {
                b: { c },
              },
            }: any) => {
              const z = 1;
              return z;
            },
          },
        },
        // #2 - multiple, nested
        {
          expected: ["b", "d"],
          input: {
            funcRef: ({ a: { b } }: any, { c: { d } }: any) => {
              const z = 1;
              return z;
            },
          },
        },
      ].forEach(testInputOutput);
    });

    // >>> Array Destructuring >>>
    describe(">>> array destructuring", () => {
      [
        // #0 - simple
        {
          expected: ["a"],
          input: {
            funcRef: ([a]: any) => {
              const z = 1;
              return z;
            },
          },
        },
        // #1 - nested
        {
          expected: ["a", "b", "c"],
          input: {
            funcRef: ([a, [b, [c]]]: any) => {
              const z = 1;
              return z;
            },
          },
        },
        // #2 - multiple, nested
        {
          expected: ["a", "b", "c", "d", "e", "f"],
          input: {
            funcRef: ([a, [b, [c]]]: any, [d, [e, [f]]]: any) => {
              const z = 1;
              return z;
            },
          },
        },
      ].forEach(testInputOutput);
    });

    // >>> Comments >>>
    describe(">>> comments", () => {
      [
        // #0 - simple double slash
        {
          expected: ["a"],
          input: {
            funcRef: (
              a: any, // )comment
            ) => {
              const z = 1;
              return z;
            },
          },
        },
        // #1 - double double slash
        {
          expected: ["a", "b"],
          input: {
            funcRef: (
              a: any, // )comment
              b: any, // )comment
            ) => {
              const z = 1;
              return z;
            },
          },
        },
        // #2 - single multiline
        {
          expected: ["a", "b"],
          input: {
            funcRef: (
              a: any,
              /* )comment */
              b: any, /* )comment */
            ) => {
              const z = 1;
              return z;
            },
          },
        },
        // #2 - mixed
        {
          expected: ["a", "b"],
          input: {
            funcRef: (
              a: any,
              /* )comment */
              b: any, // ) comment
            ) => {
              const z = 1;
              return z;
            },
          },
        },
      ].forEach(testInputOutput);
    });

    // >>> Regex >>>
    describe(">>> regex", () => {
      [
        // #0 - single
        {
          expected: ["a", "b"],
          input: {
            funcRef: (a = /\/*foo\//, b: any) => {
              const z = 1;
              return z;
            },
          },
        },
        // #0 - double
        {
          expected: ["a", "b", "c", "d"],
          input: {
            funcRef: (a = /\/*foo\//, b: any, c = /\/*foo\//, d: any) => {
              const z = 1;
              return z;
            },
          },
        },
      ].forEach(testInputOutput);
    });

    // >>> Mixed Args >>>
    describe(">>> mixed args", () => {
      [
        // #0 - everything
        {
          expected: ["a", "b", "c", "d", "e", "f"],
          input: {
            funcRef: (
              a = /\/*foo\//,
              b = (x: any, y: any) => undefined /** )comment */,
              c = 1,
              { j: { d } }: any,
              /*** )comment *****/
              [e, [f]]: any, // )comment
            ) => {
              const z = (foo: any, bar: any, baz: any) => [foo, bar, baz];
              const n = {
                foobar: 1,
              };
              return [z, n];
            },
          },
        },
      ].forEach(testInputOutput);
    });
  });
});

const composeFactory = () => compose({});
