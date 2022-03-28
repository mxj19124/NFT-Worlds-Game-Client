declare module 'nbt' {
  import { type Buffer } from 'buffer'

  export const tagTypes: {
    end: 0
    byte: 1
    short: 2
    int: 3
    long: 4
    float: 5
    double: 6
    byteArray: 7
    string: 8
    list: 9
    compound: 10
    intArray: 11
    longArray: 12
  }

  export const tagTypeNames: {
    '0': 'end'
    '1': 'byte'
    '2': 'short'
    '3': 'int'
    '4': 'long'
    '5': 'float'
    '6': 'double'
    '7': 'byteArray'
    '8': 'string'
    '9': 'list'
    '10': 'compound'
    '11': 'intArray'
    '12': 'longArray'
  }

  export function writeUncompressed<T extends Record<string, unknown>>(
    value: T
  ): ArrayBuffer
  export function parseUncompressed(data: ArrayBuffer | Buffer): {
    name: string
    value: Record<string, Record<string, unknown>>
  }

  export function parse(
    data: ArrayBuffer | Buffer,
    callback: (
      error: Error,
      result: { name: string; value: Record<string, unknown> }
    ) => void
  ): void
}
