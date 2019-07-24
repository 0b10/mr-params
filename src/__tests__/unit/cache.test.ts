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

import factory, { CacheDebugError } from "../../cache";

describe("Unit Tests: cache", () => {
  describe("factory", () => {
    it("should be defined", () => {
      expect(typeof factory).toBe("function");
    });

    it("should return an object", () => {
      expect(typeof factory()).toBe("object");
    });
  });

  describe("cache function", () => {
    it("should return false when a given key isn't present", () => {
      const { get } = factory();
      expect(get("function fn() {}")).toBe(false);
    });

    it("should put the key, and return a result on the second call", () => {
      const { get, put } = factory();
      const key = "function fn() {}";
      expect(get(key)).toBe(false);
      put(key, []);
      expect(get("function fn() {}")).toEqual([]);
    });

    it("should put multiple values, and return the correct results", () => {
      const { get, put } = factory();
      const keys = [
        { key: "function fn(a) {}", value: ["a"] },
        { key: "function fn(a, b) {}", value: ["a", "b"] },
        { key: "function fn(a, b, c) {}", value: ["a", "b", "c"] },
      ];

      keys.forEach(({ key, value }) => {
        expect(get(key)).toBe(false);
        put(key, value);
        expect(get(key)).toEqual(value);
      });
    });

    it("should throw when debug === true, a key is inserted more than once", () => {
      const { get, put } = factory(true);
      put("() => undefined", []);
      expect(() => {
        put("() => undefined", []);
      }).toThrow(CacheDebugError);
    });
  });
});
