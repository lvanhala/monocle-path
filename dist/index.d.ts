import { Lens, Optional } from 'monocle-ts';
export declare type OpticsParam<A, B> = Lens<A, B> | Optional<A, B>;
export declare function find<T>(f: (v: T, index: number) => boolean): Optional<T[], T>;
export declare function byIndex<T>(n: number): Optional<T[], T>;
export interface ToOptional<T, B> {
    toOptional: () => Optional<T, B>;
}
export interface ArrayPath<T, B, I> extends ToOptional<T, B> {
    byIndex: (index: number) => ReturnValue<T, I>;
    find: (f: (v: I, index: number) => boolean) => ReturnValue<T, I>;
}
export interface ObjectPath<T, B> extends ToOptional<T, B> {
    prop: <K extends keyof B>(field: K) => ReturnValue<T, B[K]>;
}
export declare type ReturnValue<T, B> = [B] extends [Array<infer I>] ? ArrayPath<T, B, I> : ObjectPath<T, B>;
export declare function monoclePath<T, B = T>(): ReturnValue<T, B>;
