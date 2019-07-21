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

import { parse } from "@babel/parser";
import traverse, { Node, NodePath, Visitor } from "@babel/traverse";
import { File } from "@babel/types";

export class Params implements IParams {
  private ast: File;
  private rootVisitor: Visitor;
  private paramNames: string[];

  /**
   * Constructor
   * @param funcStr - A string representation of a function. The assumption is that this is not an
   *  anonymous function declaration - e.g. function() {}, but anonymous arrow functions are okay.
   *  It should be valid syntax accepted for the toplevel.
   * @example new Params("() => undefined");
   */
  constructor(funcStr: string) {
    this.paramNames = [];
    const pushParam = (paramName: string) => this.paramNames.push(paramName);

    this.rootVisitor = {
      Function(path: NodePath) {
        const { params } = path.node as any; // params is checked

        if (params && params.length > 0) {
          // console.log(params);
          params.forEach((paramNode: Node) => {
            // console.log(paramNode);
            const { name, type } = paramNode as any; // name is checked;
            switch (type) {
              case "Identifier":
                if (name) {
                  pushParam(name);
                }
                break;
              case "ObjectPattern":
                // path.traverse(ObjectPropsVisitor);
                break;
              default:
                break;
            }
          });
        }
      },
    };
    this.ast = parse(funcStr);
  }

  public parse() {
    traverse(this.ast, this.rootVisitor);
    return this.paramNames.length > 0 ? this.paramNames : false;
  }
}

interface IParams {
  parse(): string[] | boolean;
}
