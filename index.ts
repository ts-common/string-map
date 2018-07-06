import * as i from "@ts-common/iterator"

export interface StringMap<T> {
    readonly [key: string]: T;
}

export type Entry<T> = Readonly<[string, T]>

export function entries<T>(input: StringMap<T|undefined>): Iterable<Entry<T>> {
    function *iterator() {
        for (const name in input) {
            const value = input[name]
            if (value !== undefined) {
                yield entry(name, value)
            }
        }
    }
    return i.iterable(iterator)
}

export function names<T>(input: StringMap<T>): Iterable<string> {
    return i.map(entries(input), entryName)
}

export function values<T>(input: StringMap<T|undefined>): Iterable<T> {
    return i.map(entries(input), entryValue)
}

export function entry<T>(name: string, value: T): Entry<T> {
    return [name, value]
}

export const enum EntryIndex {
    Name = 0,
    Value = 1,
}

export function entryName<T>(entry: Entry<T>): string {
    return entry[EntryIndex.Name]
}

export function entryValue<T>(entry: Entry<T>): T {
    return entry[EntryIndex.Value]
}

export function groupBy<T>(input: Iterable<Entry<T>>, reduceFunc: (a: T, b: T) => T): StringMap<T> {
    const result: { [key: string]: T } = {}
    for (const nv of input) {
        const n = entryName(nv)
        const v = entryValue(nv)
        const prior = result[n]
        result[n] = prior === undefined ? v : reduceFunc(prior, v)
    }
    return result
}

export function stringMap<T>(input: Iterable<Entry<T>>): StringMap<T> {
    const result: { [name: string]: T } = {}
    for (const nv of input) {
        result[entryName(nv)] = entryValue(nv)
    }
    return result
}
