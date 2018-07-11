import * as _ from "@ts-common/iterator"

export type Tuple0 = ReadonlyArray<never>

export const tuple0: Tuple0 = []

export interface Tuple1<T> extends ReadonlyArray<T> {
    readonly [0]: T
}

export function tuple1<T>(v: T): Tuple1<T> { return [v] }

export interface Tuple2<T0, T1> extends ReadonlyArray<T0 | T1> {
    readonly [0]: T0
    readonly [1]: T1
}

export function tuple2<T0, T1>(v0: T0, v1: T1): Tuple2<T0, T1> { return [v0, v1] }

export const enum EntryIndex {
    Key = 0,
    Value = 1,
}

export type Entry<T> = Tuple2<string, T>

export const entry: <T>(key: string, value: T) => Entry<T> = tuple2

export function entryKey<T>(e: Entry<T>): string {
    return e[EntryIndex.Key]
}

export function entryValue<T>(e: Entry<T>): T {
    return e[EntryIndex.Value]
}

export interface StringMap<T> {
    readonly [key: string]: T;
}

export function allKeys<T>(input: StringMap<T|undefined>): Iterable<string> {
    function *iterator() {
        /* tslint:disable-next-line:no-loop-statement */
        for (const key in input) {
            yield key
        }
    }
    return _.iterable(iterator)
}

export function entries<T>(input: StringMap<T|undefined>): Iterable<Entry<T>> {
    return _.filterMap(
        allKeys(input),
        key => {
            const value = input[key]
            return value !== undefined ? entry(key, value) : undefined
        })
}

export function keys<T>(input: StringMap<T>): Iterable<string> {
    return _.map(entries(input), entryKey)
}

export function values<T>(input: StringMap<T|undefined>): Iterable<T> {
    return _.map(entries(input), entryValue)
}

export function groupBy<T>(input: Iterable<Entry<T>>, reduceFunc: (a: T, b: T) => T): StringMap<T> {
    /* tslint:disable-next-line:readonly-keyword */
    const result: { [key: string]: T } = {}
    _.forEach(input, ([key, value]) => {
        const prior = result[key]
        /* tslint:disable-next-line:no-object-mutation no-expression-statement */
        result[key] = prior === undefined ? value : reduceFunc(prior, value)
    })
    return result
}

export function stringMap<T>(input: Iterable<Entry<T>>): StringMap<T> {
    return groupBy(input, v => v)
}
