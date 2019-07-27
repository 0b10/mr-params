import { ICacheOps } from "./cache";
import { IWrapper } from "./helpers";
export default function ({ cache, debug, cacheFactory, }?: IOptions): (funcRef: (...args: any[]) => any, wrapWith?: any[]) => boolean | string[] | IWrapper;
export interface IOptions {
    cache?: boolean;
    cacheFactory?: (debug: boolean) => ICacheOps;
    debug?: boolean;
}
export { ICacheOps } from "./cache";
