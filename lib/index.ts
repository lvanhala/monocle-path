import {Lens, Optional} from 'monocle-ts'
import { some, none} from 'fp-ts/lib/Option'

export type OpticsParam<A, B> = Lens<A, B> | Optional<A, B>

const isLens = <A, B>(p: OpticsParam<A, B>): p is Lens<A,B> => p._tag === 'Lens'

const compose = <A, B, C> (
  l1: OpticsParam<A,B>,
  l2: OpticsParam<B, C>,
) => {
  if (isLens(l1)) {
    return isLens(l2) ?
      l1.compose(l2) :
      l1.composeOptional(l2)
  } else {
    return isLens(l2) ?
      l1.composeLens(l2) :
      l1.compose(l2)
  }
}

export function find<T>(f: (v: T, index: number) => boolean) {
  return new Optional(
    (items: T[]) => {
      const index = items.findIndex(f)
      if (index >= 0) {
        return some(items[index])
      } else {
        return none
      }
    },
    (item: T) => (items: T[]) => {
      const clone = items.slice(0)
      const index = items.findIndex(f)
      if (index >= 0) {
        clone[index] = item
      }
      return clone
    }
  )
}

export function byIndex<T>(n: number) {
  return new Optional(
    (items: T[]) => n >= 0 && n < items.length ? some(items[n]) : none,
    (item: T) => (items: T[]) => {
      if (n >= 0 && n < items.length) {
        const clone = items.slice(0)
        clone[n] = item
        return clone
      } else {
        return items
      }
    }
  )
}

export interface ToOptional<T, B> {
  toOptional: () => Optional<T, B>
}

export interface ArrayPath<T, B, I> extends ToOptional<T, B> {
  byIndex: (index: number) => ReturnValue<T, I>,
  find: (f: (v: I, index: number) => boolean) => ReturnValue<T, I>
}

export interface ObjectPath<T, B> extends ToOptional<T, B> {
  prop: <K extends keyof B>(field: K) => ReturnValue<T, B[K]>
}

export type ReturnValue<T, B> = [B] extends [Array<infer I>] ? ArrayPath<T, B, I> : ObjectPath<T, B>

const createLensFromPathItem = (pathItem: any): OpticsParam<any, any> => {
  if (typeof pathItem === 'string') {
    return Lens.fromProp<any, any>(pathItem)
  } else if (typeof pathItem === 'number') {
    return byIndex(pathItem)
  } else if (typeof pathItem === 'function') {
    return find(pathItem)
  } else {
    throw new Error('path item type not supported')
  }
}

class PathItem<T, B = T> {
  constructor(private currentPath: any[]) {
  }

  prop<K extends keyof B>(field: K) {
    return new PathItem<T, B[K]>(this.currentPath.concat(field))
  }

  byIndex(index: number) {
    return new PathItem(this.currentPath.concat(index))
  }

  find(f: (v: T, index: number) => boolean) {
    return new PathItem(this.currentPath.concat(f))
  }

  toOptional(): Optional<T, B> {
    const first = createLensFromPathItem(this.currentPath[0])
    const path = this.currentPath.slice(1).reduce((lens, selector) => compose(lens, createLensFromPathItem(selector)), first)
    return isLens(path) ? path.asOptional() : path
  }
}

export function monoclePath<T, B = T>(): ReturnValue<T, B> {
  return new PathItem<T, B>([]) as any
}
