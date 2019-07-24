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

import nativeCacheFactory, { ICacheOps } from "./cache";
import { parse } from "./params";
import { makeStub, stripEnds } from "./preprocess";

// Factory
export default function({
  cache = true,
  debug = false,
  cacheFactory = nativeCacheFactory,
}: IOptions = {}) {
  const { get, put } = cacheFactory(debug);
  return (funcRef: (...args: any[]) => any): string[] | boolean => {
    // Preprocessing depends on valid syntax. Ensuring a function reference solves a lot of potential syntax issues.
    if (typeof funcRef !== "function") {
      throw new TypeError(`funcRef must be a function reference, not: '${typeof funcRef}'`);
    }

    const stubbedFuncStr = makeStub(stripEnds(funcRef.toString()));
    if (cache) {
      const cacheHit = get(stubbedFuncStr);
      if (cacheHit) {
        return cacheHit;
      }
    }
    const paramNames = parse(stubbedFuncStr);
    if (cache) {
      put(stubbedFuncStr, paramNames);
    }
    return paramNames;
  };
}

export interface IOptions {
  cache?: boolean;
  cacheFactory?: (debug: boolean) => ICacheOps;
  debug?: boolean;
}
