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

import { PreprocessingError } from "./errors";

/**
 * Strip the body content from a function string.
 *
 * The assumption here is the function string conforms to valid syntax, Valid syntax is the client's
 *  responsibility.
 *
 * This function should not be used directly, and instead encapsulated within a function that has
 *  somehow validated the syntax - for example, a function that accepts a function reference as an
 *  argument, and therefore is subject to the runtime's syntax validation.
 * @param funcStr - A string representation of a function
 * @returns A string representation of a function with the body stripped out.
 * @example stripBody("(a, b, c) => { foo, bar, baz }")  // =>  "(a, b, c) => { }"
 */
export const stripBody = (funcStr: string): string => {
  let canary = 0;
  let index = 0;
  for (const c of funcStr) {
    if (c === "(") {
      canary++;
    } else if (c === ")") {
      canary--;
      if (canary === 0) {
        index++;
        break;
      } else if (canary < 0) {
        throw new PreprocessingError(
          `Invalid function string - the brackets do not match: '${funcStr}'`,
        );
      }
    }
    index++;
  }

  // catch cases like (() <-- more open than close
  if (canary !== 0) {
    throw new PreprocessingError(
      `Invalid function string - the brackets do not match: '${funcStr}'`,
    );
  }
  return funcStr.slice(0, index);
};

const RE_ARROW_FUNC = /^\(/;
const RE_FUNCTION_DEFINITION = /^function */;
/**
 * Get a stub to replace the stripped out body portion of a function definition string.
 *
 * It is assumed that the function definition is in the form: 'function fn(...)', or '(...)'. This function
 *  just tests the first portion of the string, to determine what kind of function it is, then returns
 *  an appropriate stub body.
 * @param funcSubStr - a substring of the function definition string, where the body portion has been
 *  stripped off.
 * @returns a string, an appropriate stub to replace the stripped out definition body.
 * @example
 * getBodyStub('function fn(a, b, c)')  // " => undefined"
 * getBodyStub('(a, b, c)')  // " { }"
 * @throws PreprocessingError - when the definition doesn't match either of the previously mentioned
 *  patterns.
 */
export const getBodyStub = (funcSubStr: string): string => {
  let stub: string = "";
  if (RE_ARROW_FUNC.test(funcSubStr)) {
    stub = " => undefined";
  } else if (RE_FUNCTION_DEFINITION.test(funcSubStr)) {
    stub = " { }";
  } else {
    throw new PreprocessingError(`Invalid function definition: '${funcSubStr.slice(0, 20)}...'`);
  }
  return stub;
};
