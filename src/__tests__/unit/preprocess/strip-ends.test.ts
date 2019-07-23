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

import { PreprocessingError } from "../../../errors";
import { stripEnds } from "../../../preprocess";
import { testStripEnds, testStripEndsThrows } from "./helpers";

describe("Unit Tests: preprocess", () => {
  describe("stripEnds()", () => {
    it("should be defined", () => {
      expect(typeof stripEnds).toBe("function");
    });

    // >>> ARROW FUNCTIONS >>>
    describe(">>> for arrow functions", () => {
      [
        // #0 - simple
        {
          expected: "()",
          input: "() => undefined",
        },
        // #1 - with args
        {
          expected: "(a, b, c)",
          input: "(a, b, c) => undefined",
        },
        // #2 - with default args
        {
          expected: "(a = 1, b = 2, c = 3)",
          input: "(a = 1, b = 2, c = 3) => undefined",
        },
        // #3 - with callbacks are default args
        {
          expected: "(a = () => undefined, b = () = undefined)",
          input: "(a = () => undefined, b = () = undefined) => undefined",
        },
        // #4 - nested callbacks as default args
        {
          expected:
            "(a = (x = () => undefined) => undefined, b = (y = (z = () => undefined) => undefined) = undefined)",
          input:
            "(a = (x = () => undefined) => undefined, b = (y = (z = () => undefined) => undefined) = undefined) => undefined",
        },
        // #5 - object destructuring
        {
          expected: "({ a: {b: { c } } })",
          input: "({ a: {b: { c } } }) => undefined",
        },
        // #6 - array destructuring
        {
          expected: "([a, [b, [ c ]]])",
          input: "([a, [b, [ c ]]]) => undefined",
        },
      ].forEach(testStripEnds);
    });

    // >>> FUNCTION DEFINITIONS >>>
    describe(">>> for function definitions", () => {
      [
        // #0 - simple
        {
          expected: "()",
          input: "function fn() { return undefined; }",
        },
        // #1 - with args
        {
          expected: "(a, b, c)",
          input: "function fn(a, b, c) { return undefined; }",
        },
        // #2 - with default args
        {
          expected: "(a = 1, b = 2, c = 3)",
          input: "function fn(a = 1, b = 2, c = 3) { return undefined; }",
        },
        // #3 - with callbacks are default args
        {
          expected: "(a = () => undefined, b = () = undefined)",
          input: "function fn(a = () => undefined, b = () = undefined) { return undefined; }",
        },
        // #4 - nested callbacks as default args
        {
          expected:
            "(a = (x = () => undefined) => undefined, b = (y = (z = () => undefined) => undefined) = undefined)",
          input:
            "function fn(a = (x = () => undefined) => undefined, b = (y = (z = () => undefined) => undefined) = undefined) {}",
        },
        // #5 - object destructuring
        {
          expected: "({ a: {b: { c } } })",
          input: "function fn({ a: {b: { c } } }) => undefined",
        },
        // #6 - array destructuring
        {
          expected: "([a, [b, [ c ]]])",
          input: "function fn([a, [b, [ c ]]]) { }",
        },
      ].forEach(testStripEnds);

      // >>> EXTREME CASES >>>
      // This isn't testing valid javascript, but testing how it handles brackets
      describe(">>> go nuts", () => {
        [
          // #0 - multiple nested
          {
            expected: "((((((((((((( 12 )))))))))))))",
            input: "((((((((((((( 12 ))))))))))))) end",
          },
          // #1 - multiple nested at differen indices
          {
            expected: "((((())((()))((()))(((()))(((())))))))",
            input: "((((())((()))((()))(((()))(((()))))))) end",
          },
          // #2 - side by side
          {
            expected: "()",
            input: "()()()()()()()()()()()()() end",
          },
          // #3 - nested, with one at the end
          {
            expected: "((((()))))",
            input: "((((()))))() end",
          },
          // #4 - mixed, with one at the end
          {
            expected: "(({(({[[(())]]}(([[{()}]]))))((({[[{(())}]]})))}))",
            input: "(({(({[[(())]]}(([[{()}]]))))((({[[{(())}]]})))}))() end",
          },
          // #5 - mixed, nested, with random data
          {
            expected: "((abc{}{{(wuey(iroe{{{jd((ue))}((ue{[[\n]]})((jdtrte)))((\n))}}))}\t}))",
            input:
              "((abc{}{{(wuey(iroe{{{jd((ue))}((ue{[[\n]]})((jdtrte)))((\n))}}))}\t}))()()(123) end",
          },
        ].forEach(testStripEnds);
      });
    });

    // >>> COMMENTS >>>
    // These include brackets in comments to ensure parsing isn't broken
    // (an uncommented orphaned bracket should break parsing)
    describe(">>> comments", () => {
      // ~~~ Multi-line Comments ~~~
      describe("multi-line", () => {
        [
          // #0 - closing bracket
          {
            expected: "(/* ) */)",
            input: "(/* ) */) end",
          },
          // #1 - double star
          {
            expected: "(/** ) **/)",
            input: "(/** ) **/) end",
          },
          // #2 - double star left
          {
            expected: "(/** ) */)",
            input: "(/** ) */) end",
          },
          // #3 - double star right
          {
            expected: "(/* ) **/)",
            input: "(/* ) **/) end",
          },
          // #3 - lots of stars
          {
            expected: "(/*********** ) ***********/)",
            input: "(/*********** ) ***********/) end",
          },
          // #4 - with line breaks
          {
            expected: "(/* \n\n)\n\n */)",
            input: "(/* \n\n)\n\n */) end",
          },
          // #5 - with line breaks and tabs
          {
            expected: "(/* \n\n\t\t\t)\t\t\t\n\n */)",
            input: "(/* \n\n\t\t\t)\t\t\t\n\n */) end",
          },
          // #6 - with extra args
          {
            expected: "(a, b, /* ) */ c)",
            input: "(a, b, /* ) */ c) end",
          },
          // #7 - multiple comments
          {
            expected: "(a, b, /* ) */ c, /** ) ** d, /*** ) ***/ e)",
            input: "(a, b, /* ) */ c, /** ) ** d, /*** ) ***/ e) end",
          },
          // #8 - go nuts
          {
            expected:
              "(a, b, c, /**a**s*d*f\n**g*\n4*\n\t4 / / / \t* ) \n**)))) / / /* /* /** //*****/, x, /* ) */ y, /* ) */ z)",
            input:
              "(a, b, c, /**a**s*d*f\n**g*\n4*\n\t4 / / / \t* ) \n**)))) / / /* /* /** //*****/, x, /* ) */ y, /* ) */ z) end",
          },
        ].forEach(testStripEnds);
      });

      // ~~~ Double Slash Comments ~~~
      describe("double slash", () => {
        [
          // #0 - simple
          {
            expected: "(// )\n)",
            input: "(// )\n) end",
          },
          // #1 - with args
          {
            expected: "(a, b, // )\n c)",
            input: "(a, b, // )\n c) end",
          },
          // #2 - multiple comments
          {
            expected: "(a, b, // )\n c, // )\n d)",
            input: "(a, b, // )\n c, // )\n d) end",
          },
          // #3 - with nested slashes, and tab chars
          {
            expected: "(// )\t\t//\t//\n, // )\t//\t\t//\n)",
            input: "(// )\t\t//\t//\n, // )\t//\t\t//\n) end",
          },
          // #4 - go nuts
          {
            expected: "(// )\t\tiuirueiod,mdsd//\t//sddw\n, // )\t//dwdaerd\t\t//\n)",
            input: "(// )\t\tiuirueiod,mdsd//\t//sddw\n, // )\t//dwdaerd\t\t//\n) end",
          },
          // #4 - go nuts
          {
            expected: "(//////////////// ) \n, a)",
            input: "(//////////////// ) \n, a) end",
          },
        ].forEach(testStripEnds);
      });

      // ~~~ Regex As Default Arg ~~~
      describe("regex as default arg", () => {
        [
          // #0 - simple
          {
            expected: "(a = /foo/)",
            input: "(a = /foo/) end",
          },
          // #1 - with /*
          {
            expected: `(a = ${/\/*/})`,
            input: `(a = ${/\/*/}) end`,
          },
          // #2 - with /*.+*/
          {
            expected: `(a = ${/\/*.+\*\\/})`,
            input: `(a = ${/\/*.+\*\\/}) end`,
          },
          // #3 - with double slashes
          {
            expected: `(a = ${/\/\//})`,
            input: `(a = ${/\/\//}) end`,
          },
          // #4 - with /*foo*/
          {
            expected: `(a = ${/\/*foo*\\ /})`,
            input: `(a = ${/\/*foo*\\ /}) end`,
          },
          // #5 - /* with no close
          {
            expected: `(a = ${/\/*foo/})`,
            input: `(a = ${/\/*foo/}) end`,
          },
          // #6 - /* with extra args
          {
            expected: `(a, b = ${/\/*foo\//}, c)`,
            input: `(a, b = ${/\/*foo\//}, c) end`,
          },
          // #7 - /* with object destructuring
          {
            expected: `(a,{  b = ${/\/*foo\//} } = {}, c)`,
            input: `(a,{  b = ${/\/*foo\//} } = {}, c) end`,
          },
          // #8 - /* with array destructuring
          {
            expected: `(a, [ b = ${/\/*foo\//} ] = [], c)`,
            input: `(a, [ b = ${/\/*foo\//} ] = [], c) end`,
          },
          // #8 - /* with other comments
          {
            expected: `(a, /* ) */ b = ${/\/*foo\//}, // )\n c)`,
            input: `(a, /* ) */ b = ${/\/*foo\//}, // )\n c) end`,
          },
        ].forEach(testStripEnds);
      });

      // ~~~ Both (composite) ~~~
      describe("both (composite)", () => {
        [
          // #0 - simple
          {
            expected: "(// )\n /* ) */)",
            input: "(// )\n /* ) */) end",
          },
          // #1 - with vars
          {
            expected: "(a, b, // )\n c, /* ) */, d)",
            input: "(a, b, // )\n c, /* ) */, d) end",
          },
          // #2 - multiple
          {
            expected: "(// )\n /* ) */ // )\n /* ) */)",
            input: "(// )\n /* ) */ // )\n /* ) */) end",
          },
          // #3 - go nuts
          {
            expected:
              "(// hdhqu878//sd*/)dwqdq76\n /*** )s/*hj*/j//*ka//76 ****/ // wueuys6*/)iqwueuy78\n /* duysa87)sda */)",
            input:
              "(// hdhqu878//sd*/)dwqdq76\n /*** )s/*hj*/j//*ka//76 ****/ // wueuys6*/)iqwueuy78\n /* duysa87)sda */) end",
          },
        ].forEach(testStripEnds);
      });
    });

    // >>> ERRORS >>>
    const errorMsgPrefix: string = "Invalid function string - the brackets do not match:";
    // ! Don't test these too thoroughly because the composing function will accept a function
    // !  reference, which means any passed function is subject to syntax validation by the runtime.
    // ! Testing edge-cases is only really useful if accepting a string from the client - only the
    // !  backend functions do that.
    // ! So the assumption here is valid syntax  - i.e. sensible matching brackets.
    describe(">>> for errors", () => {
      [
        // #0 - initial closed
        {
          expected: new PreprocessingError(`${errorMsgPrefix} ') end'`),
          input: ") end",
        },
        // #1 - one extra open
        {
          expected: new PreprocessingError(`${errorMsgPrefix} '(() end'`),
          input: "(() end",
        },
        // #2 - two extra open
        {
          expected: new PreprocessingError(`${errorMsgPrefix} '((() end'`),
          input: "((() end",
        },
        // #3 - lots, with an extra open
        {
          expected: new PreprocessingError(`${errorMsgPrefix} '((((((((()))))))) end'`),
          input: "((((((((()))))))) end",
        },
      ].forEach(testStripEndsThrows);
    });
  });
});
