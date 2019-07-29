"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:prefer-const
const cache_1 = __importDefault(require("./cache"));
const helpers_1 = require("./helpers");
const params_1 = require("./params");
// Factory
function default_1({ cache = true, debug = false, cacheFactory = cache_1.default, } = {}) {
    const { get, put } = cacheFactory(debug);
    return (funcRef, wrapWith = []) => {
        // Preprocessing depends on valid syntax. Ensuring a function reference solves a lot of potential syntax issues.
        if (typeof funcRef !== "function") {
            throw new TypeError(`funcRef must be a function reference, not: '${typeof funcRef}'`);
        }
        const funcStr = funcRef.toString();
        // >>> CACHE >>>
        const cacheResult = helpers_1.checkCache(cache, funcStr, get, wrapWith);
        if (cacheResult !== undefined) {
            return cacheResult;
        }
        // >>> PARSE >>>
        const paramNames = params_1.parse(funcStr);
        if (cache) {
            put(funcStr, paramNames);
        }
        if (wrapWith.length > 0 && paramNames) {
            // param names is exclusively false or len > 0
            return helpers_1.wrap(wrapWith, paramNames); // paramNames === guarded, is string[]
        }
        return paramNames;
    };
}
exports.default = default_1;
