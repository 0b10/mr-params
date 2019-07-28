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

// tslint:disable:forin

import { parse as babelParse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";

export const parse = (funcStr: string): string[] | false => {
  let paramNames: string[] = [];
  traverse(babelParse(funcStr), {
    Function(path: NodePath) {
      const { bindings } = path.scope;
      const identifiers = [];

      for (const key in bindings) {
        // keys are not own properties, don't filter
        const kind = bindings[key].kind as string; // They are all strings, TS just making a noise

        if (typeof kind === "string" && kind === "param") {
          const { start } = bindings[key].identifier; // Symbol position (row/column agnostic)
          identifiers.push({ name: key, pos: start });
        }
      }

      // sorts asc, then map to names array
      paramNames = identifiers
        .sort(({ pos: posA }, { pos: posB }) => (posA && posB ? posA - posB : 0)) // pos may be null (TS), do nothing
        .map(({ name }) => name);

      path.skip();
    },
  });
  return paramNames.length > 0 ? paramNames : false;
};
