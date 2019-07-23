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

// tslint:disable:prefer-for-of

import { PreprocessingError } from "./errors";

// Non-global - first match. A full function body will be present, which is costly to parse.
const RE_ANY_COMMENT = /(^\/\*(?:.|\s)*?\*\/|^\/\/.*)/u; // Comments may contain unicode  - . matches any code point
/**
 * Strip both ends of the function definition string, leaving only the arguments spec.
 *
 * The assumption here is the function string conforms to valid syntax, Valid syntax is the client's
 *  responsibility.
 *
 * This function should not be used directly, and instead encapsulated within a function that has
 *  somehow validated the syntax - for example, a function that accepts a function reference as an
 *  argument, and therefore is subject to the runtime's syntax validation.
 * @param funcStr - A string representation of a function
 * @returns A string representation of a function with the leading definition keywords, and body
 *  stripped out.
 * @example stripEnds("function fn(a, b, c) => { foo, bar, baz }")  // =>  "(a, b, c)"
 */
export const stripEnds = (funcStr: string): string => {
  let canary = 0;
  let startIndex: number | undefined;
  let index = 0;
  for (index; index < funcStr.length; index++) {
    const char = funcStr[index];
    if (char === "/") {
      /**
       * This section warrants explanation.
       * The regex will match any multiline, or single line comment. The assumptsions made are that
       *  double slash lines are delineated with a \n - i.e. valid syntax; both are any (unicode)
       *  char "greedy", and multi-line comment expressions match against invisible chars like \n and \t.
       *  This allows the engine to match against anything, until a closing statement is found.
       * If a / is preceeded with a \ e.g. \/ , then it is ignored - all regex forward slashes are escaped,
       *  so it won't match against regex. This regex guard is nested to prevent excessive string comparison tests at
       *  the topevel of the loop body.
       * This function does not throw if it cannot match a slash to a comment, this is how regexes pass. This
       *  lib will accept a function reference through it's entry point, and so the runtime will validate syntax.
       * The regex is liberal with the acceptance of excessive stars and slashes, as long as it's a valid
       *  comment.
       *
       */
      if (funcStr[index - 1] === "\\") {
        // ignore regex forward slash: foo = /\// <-- double slash
        continue;
      }
      // +++ comments +++
      // Either it finds a comment, or there's a syntax error.
      // Parsing the body won't commence because the function should return before then.
      const commentMatch = funcStr.slice(index).match(RE_ANY_COMMENT);
      if (commentMatch) {
        // fast-forward to comment end.
        // index + length -- the -1 is because the loop will index++ next iter.
        index += commentMatch[0].length - 1;
      }
      // Don't throw if no match, just assume it's valid syntax. Let the runtime do the work.
      continue;
    } else if (char === "(") {
      // +++ open parens +++
      if (startIndex === undefined) {
        // get initial boundary
        startIndex = index;
      }
      canary++; // Push (open)
    } else if (char === ")") {
      // +++ close parens +++
      canary--; // Pop (close)
      if (canary === 0) {
        // End found.
        break;
      } else if (canary < 0) {
        throw new PreprocessingError(
          `Invalid function string - the brackets do not match: '${funcStr}'`,
        );
      }
    }
  }

  // catch cases like (() <-- more open than close
  if (canary !== 0) {
    throw new PreprocessingError(
      `Invalid function string - the brackets do not match: '${funcStr}'`,
    );
  }
  return funcStr.slice(startIndex, index + 1);
};

/**
 * Get stubs to replace the stripped out body portions of a function definition string.
 *
 * @param funcSubStr - a substring of the function definition string, where the leading keywords and
 *  body portion have been stripped - ie. only the (args) portion is present.
 * @returns a string, in the form of 'function fn() { }'.
 * @example
 * makeStub('(a, b, c)')  // "function fn(a, b, c) { }"
 */
export const makeStub = (funcSubStr: string): string => `function fn${funcSubStr} { }`;
