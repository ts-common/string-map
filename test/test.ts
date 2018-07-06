/* tslint:disable:no-expression-statement readonly-keyword */
import * as _ from "../index"
import * as i from "@ts-common/iterator"
import "mocha"
import { assert } from "chai"

describe("groupBy", () => {
    it("array", () => {
        const m = i.map([1, 2, 3, 1, 3, 2, 3, 3], x => _.entry(x.toString(), 1))
        const result = _.groupBy(m, (a, b) => a + b)
        assert.deepEqual({ 1: 2, 2: 2, 3: 4 }, result)
    })
})

describe("values", () => {
    it("array", () => {
        const result = Array.from(_.values({ 1: 2, 2: 2, 3: 3 }))
        assert.deepEqual([2, 2, 3], result)
    })
    it("array with undefined", () => {
        const x: { [name: string]: number|undefined } = { 1: 2, 2: 4, t: undefined }
        const result: ReadonlyArray<number> = Array.from(_.values(x))
        assert.deepEqual([2, 4], result)
    })
})

describe("names", () => {
    it("array", () => {
        const result = Array.from(_.names({ 1: 2, 2: 2, 3: 3, 4: undefined }))
        assert.deepEqual(["1", "2", "3"], result)
    })
})

describe("entries", () => {
    it("array", () => {
        const x: { [name: string]: number } = { 1: 2, 2: 2, 3: 3 }
        const result = Array.from(_.entries(x))
        assert.deepEqual([_.entry("1", 2), _.entry("2", 2), _.entry("3", 3)], result)
    })
    it("array with undefined", () => {
        const x: { [name: string]: number|undefined } = { 1: 2, 2: 2, t: undefined }
        const result = Array.from(_.entries(x))
        assert.deepEqual([_.entry("1", 2), _.entry("2", 2)], result)
    })
})

describe("stringMap", () => {
    it("stringMap", () => {
        const result = _.stringMap([["a", 2], ["b", 4]])
        assert.deepEqual({ a: 2, b: 4 }, result)
    })
})
