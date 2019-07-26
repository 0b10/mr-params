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

import { testInputOutput, testWrapStateChange } from "./helpers";

describe("Unit Tests: helpers (root)", () => {
  describe("wrap()", () => {
    describe(">>> cache disabled", () => {
      // >>> CACHE DISABLED >>>
      [
        // #0 - single arg
        {
          expected: { a: 1 },
          input: {
            funcRef: (a: any) => undefined,
            wrapWith: [1],
          },
          options: {
            cache: false,
          },
        },
        // #1 - multiple args
        {
          expected: { a: 1, g: 2, i: 3 },
          input: {
            funcRef: (a: any, g: any, i: any) => undefined,
            wrapWith: [1, 2, 3],
          },
          options: {
            cache: false,
          },
        },
      ].forEach(testInputOutput);
    });

    describe(">>> cache enabled", () => {
      // >>> CACHE ENABLED >>>
      [
        // #0 - single arg
        {
          expected: { a: 1 },
          input: {
            funcRef: (a: any) => undefined,
            wrapWith: [1],
          },
          options: {
            cache: true,
          },
        },
        // #1 - multiple args
        {
          expected: { a: 1, g: 2, i: 3 },
          input: {
            funcRef: (a: any, g: any, i: any) => undefined,
            wrapWith: [1, 2, 3],
          },
          options: {
            cache: true,
          },
        },
      ].forEach(testInputOutput);
    });

    describe(">>> disable wrapWith, cache result, then enable wrapWith", () => {
      // >>> CACHE ENABLED >>>
      [
        // #0 - wrap, then no wrap. no args
        {
          expectedAfter: false,
          expectedBefore: false,
          funcRef: () => undefined,
          options: {
            cache: true,
          },
          wrapWithAfter: undefined,
          wrapWithBefore: [1],
        },
        // #1 - wrap, then no wrap. single arg
        {
          expectedAfter: ["a"],
          expectedBefore: { a: 1 },
          funcRef: (a: any) => undefined,
          options: {
            cache: true,
          },
          wrapWithAfter: undefined,
          wrapWithBefore: [1],
        },
        // #2 - wrap, then no wrap. multiple args
        {
          expectedAfter: ["a", "g", "i"],
          expectedBefore: { a: 1, g: 2, i: 3 },
          funcRef: (a: any, g: any, i: any) => undefined,
          options: {
            cache: true,
          },
          wrapWithAfter: undefined,
          wrapWithBefore: [1, 2, 3],
        },
        // #3 - no wrap, then wrap. no args
        {
          expectedAfter: false,
          expectedBefore: false,
          funcRef: () => undefined,
          options: {
            cache: true,
          },
          wrapWithAfter: [1],
          wrapWithBefore: undefined,
        },
        // #4 - no wrap, then wrap. single arg
        {
          expectedAfter: { a: 1 },
          expectedBefore: ["a"],
          funcRef: (a: any) => undefined,
          options: {
            cache: true,
          },
          wrapWithAfter: [1],
          wrapWithBefore: undefined,
        },
        // #5 - no wrap, then wrap. multiple args
        {
          expectedAfter: { a: 1, g: 2, i: 3 },
          expectedBefore: ["a", "g", "i"],
          funcRef: (a: any, g: any, i: any) => undefined,
          options: {
            cache: true,
          },
          wrapWithAfter: [1, 2, 3],
          wrapWithBefore: undefined,
        },
      ].forEach(testWrapStateChange);
    });
  });
});
