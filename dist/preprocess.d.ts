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
export declare const stripEnds: (funcStr: string) => string;
/**
 * Get stubs to replace the stripped out body portions of a function definition string.
 *
 * @param funcSubStr - a substring of the function definition string, where the leading keywords and
 *  body portion have been stripped - ie. only the (args) portion is present.
 * @returns a string, in the form of 'function fn() { }'.
 * @example
 * makeStub('(a, b, c)')  // "function fn(a, b, c) { }"
 */
export declare const makeStub: (funcSubStr: string) => string;
