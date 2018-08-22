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
    readonly [key: string]: T|undefined;
}

export type PartialStringMap<K extends string, V> = {
    readonly [k in K]: V
}

export const toStringMap = <K extends string, V>(v: PartialStringMap<K, V>): StringMap<V> => v

export interface MutableStringMap<T> {
    // tslint:disable-next-line:readonly-keyword
    [key: string]: T|undefined
}

export type StringMapItem<T> = T extends StringMap<infer I> ? I : never

export const allKeys = <T>(input: StringMap<T>|undefined|null): Iterable<string> => {
    function *iterator() {
        // tslint:disable-next-line:no-if-statement
        if (input === undefined || input === null) {
            return
        }
        /* tslint:disable-next-line:no-loop-statement */
        for (const key in input) {
            yield key
        }
    }
    return _.iterable(iterator)
}

export const entries = <T>(input: StringMap<T>|undefined|null): Iterable<Entry<T>> => {
    // tslint:disable-next-line:no-if-statement
    if (input === undefined || input === null) {
        return []
    }
    return _.filterMap(
        allKeys(input),
        key => {
            const value = input[key]
            return value !== undefined ? entry(key, value) : undefined
        })
}

export const keys = <T>(input: StringMap<T>|undefined|null): Iterable<string> =>
    _.map(entries(input), entryKey)

export const values = <T>(input: StringMap<T>|undefined|null): Iterable<T> =>
    _.map(entries(input), entryValue)

export const groupBy = <T>(
    input: Iterable<Entry<T>>,
    reduceFunc: (a: T, b: T) => T
): StringMap<T> => {
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

export const map = <S, R>(source: StringMap<S>, f: (v: S, k: string) => R): StringMap<R> =>
    stringMap(_.map(entries(source), ([k, v]) => entry(k, f(v, k))))

export const merge = <T>(a: StringMap<T>, b: StringMap<T>): StringMap<T> =>
    stringMap(_.concat(entries(a), entries(b)))

// Performs a partial deep comparison between object and source to determine if object contains
// equivalent property values.
// See also https://lodash.com/docs/4.17.10#isMatch
export const isMatch = <O, S>(object: StringMap<O>, source: StringMap<S>): boolean =>
    _.every(entries(source), ([key, value]) => _.isStrictEqual(object[key], value))

export const isEqual = <A, B>(a: StringMap<A>, b: StringMap<B>): boolean =>
    _.isStrictEqual(a, b) || (isMatch(a, b) && isMatch(b, a))
