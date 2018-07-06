import * as i from "@ts-common/iterator"

export interface StringMap<T> {
    readonly [key: string]: T;
}

export const enum EntryIndex {
    Name = 0,
    Value = 1,
}

export interface Entry<T> {
    readonly [EntryIndex.Name]: string
    readonly [EntryIndex.Value]: T
    /**
     * The property is required for destruction.
     */
    /* tslint:disable-next-line:no-mixed-interface */
    readonly [Symbol.iterator]: () => IterableIterator<string|T>
}

export function entries<T>(input: StringMap<T|undefined>): Iterable<Entry<T>> {
    function *iterator() {
        /* tslint:disable-next-line:no-loop-statement */
        for (const name in input) {
            const value = input[name]
            /* tslint:disable-next-line:no-if-statement */
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

export function entryName<T>(e: Entry<T>): string {
    return e[EntryIndex.Name]
}

export function entryValue<T>(e: Entry<T>): T {
    return e[EntryIndex.Value]
}

export function groupBy<T>(input: Iterable<Entry<T>>, reduceFunc: (a: T, b: T) => T): StringMap<T> {
    /* tslint:disable-next-line:readonly-keyword */
    const result: { [key: string]: T } = {}
    i.forEach(input, ([name, value]) => {
        const prior = result[name]
        /* tslint:disable-next-line:no-object-mutation no-expression-statement */
        result[name] = prior === undefined ? value : reduceFunc(prior, value)
    })
    return result
}

export function stringMap<T>(input: Iterable<Entry<T>>): StringMap<T> {
    return groupBy(input, v => v)
}
