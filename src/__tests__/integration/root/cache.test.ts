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
// tslint:disable:no-empty

import compose from "../../..";
import { makeCacheFactory, testCache } from "./helpers";

describe("Integration Tests: root", () => {
  // FIXME: do test with wrapWith
  describe("cache", () => {
    [
      // #0 - cache hit
      {
        cacheEnabled: true,
        cacheHit: true,
        getCalls: 1,
        putCalls: 0,
      },
      // #1 - cache miss
      {
        cacheEnabled: true,
        cacheHit: false,
        getCalls: 1,
        putCalls: 1,
      },
      // #2 - cache disabled
      {
        cacheEnabled: false,
        cacheHit: false,
        getCalls: 0,
        putCalls: 0,
      },
      // #2 - use wrapWith miss
      {
        cacheEnabled: true,
        cacheHit: false,
        getCalls: 1,
        putCalls: 1,
        wrapWith: true,
      },
      // #2 - use wrapWith hit
      {
        cacheEnabled: true,
        cacheHit: true,
        getCalls: 1,
        putCalls: 0,
        wrapWith: true,
      },
    ].forEach(testCache);

    it("should be enabed by default", () => {
      const { mockCacheFactory, mockGet, mockPut } = makeCacheFactory(false);
      const parse = compose({ debug: true, cacheFactory: mockCacheFactory });
      parse(() => undefined);
      expect(mockGet.mock.calls.length).toBe(1);
      expect(mockPut.mock.calls.length).toBe(1);
    });
  });
});
