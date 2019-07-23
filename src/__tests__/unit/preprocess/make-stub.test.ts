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

import { makeStub } from "../../../preprocess";
import { testMakeStub } from "./helpers";

describe("Unit Tests: preprocess", () => {
  describe("makeStub()", () => {
    it("should be defined", () => {
      expect(typeof makeStub).toBe("function");
    });

    // >>> SUCCESS >>>
    // ! It's assumed the ends have already been stripped by stripEnds()
    [
      // #0 - without args
      {
        expected: "function fn() { }",
        input: "()",
      },
      // #1 - with args
      {
        expected: "function fn(a, b, c) { }",
        input: "(a, b, c)",
      },
      // #2 - with complex args
      {
        expected: "function fn(a,  { b: { e } }, [ c, [ d ] ] ]) { }",
        input: "(a,  { b: { e } }, [ c, [ d ] ] ])",
      },
    ].forEach(testMakeStub);
  });
});
