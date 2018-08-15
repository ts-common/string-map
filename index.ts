import * as _ from "@ts-common/iterator"
import { Tuple2, tuple2 } from "@ts-common/tuple"

export const enum EntryIndex {
    Key = 0,
    Value = 1,
}

export type Entry<T> = Tuple2<string, T>

export const entry: <T>(key: string, value: T) => Entry<T> = tuple2

export const entryKey = <T>(e: Entry<T>): string =>
    e[EntryIndex.Key]

export const entryValue = <T>(e: Entry<T>): T =>
    e[EntryIndex.Value]

export interface StringMap<T> {
    readonly [key: string]: T;
}

export interface MutableStringMap<T> {
    // tslint:disable-next-line:readonly-keyword
    [key: string]: T
}

export type StringMapItem<T> = T extends StringMap<infer I> ? I : never

export const allKeys = <T>(input: StringMap<T|undefined>): Iterable<string> => {
    function *iterator() {
        /* tslint:disable-next-line:no-loop-statement */
        for (const key in input) {
            yield key
        }
    }
    return _.iterable(iterator)
}

export const entries = <T>(input: StringMap<T|undefined>): Iterable<Entry<T>> => {
    return _.filterMap(
        allKeys(input),
        key => {
            const value = input[key]
            return value !== undefined ? entry(key, value) : undefined
        })
}

export const keys = <T>(input: StringMap<T>): Iterable<string> =>
    _.map(entries(input), entryKey)

export const values = <T>(input: StringMap<T|undefined>): Iterable<T> =>
    _.map(entries(input), entryValue)

export const groupBy = <T>(input: Iterable<Entry<T>>, reduceFunc: (a: T, b: T) => T): StringMap<T> => {
    /* tslint:disable-next-line:readonly-keyword */
    const result: MutableStringMap<T> = {}
    _.forEach(input, ([key, value]) => {
        const prior = result[key]
        /* tslint:disable-next-line:no-object-mutation no-expression-statement */
        result[key] = prior === undefined ? value : reduceFunc(prior, value)
    })
    return result
}

export const stringMap = <T>(input: Iterable<Entry<T>>): StringMap<T> =>
    groupBy(input, v => v)

export const map = <S, R>(source: StringMap<S>, f: (s: Entry<S>) => Entry<R>): StringMap<R> =>
    stringMap(_.map(entries(source), f))

// TypeScript gives an error in case if type of a and type of b are different
const strictEquals = (a: unknown, b: unknown) => a === b

const isSubset = <A, B>(set: StringMap<A>, subset: StringMap<B>): boolean =>
    _.every(entries(subset), ([key, value]) => strictEquals(set[key], value))

export const equals = <A, B>(a: StringMap<A>, b: StringMap<B>): boolean =>
    strictEquals(a, b) || (isSubset(a, b) && isSubset(b, a))
