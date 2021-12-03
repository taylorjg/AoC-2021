const fs = require('fs').promises

const range = n => Array.from(Array(n).keys())

const oppositeValue = value => {
  switch (value) {
    case 1: return 0
    case 0: return 1
    default: throw new Error(`[opposite] unknown value (${value})`)
  }
}

const flipBits = binaryString =>
  Array.from(binaryString).map(ch => ch === '1' ? '0' : '1').join('')

const binaryStringToDecimal = binaryString =>
  parseInt(binaryString, 2)

const mostCommonBit = (binaryStrings, bit) => {
  const lastResult = binaryStrings.reduce(
    (acc, binaryString) => {
      const isOne = binaryString[bit] == '1'
      return isOne
        ? { ...acc, ones: acc.ones + 1 }
        : { ...acc, zeros: acc.zeros + 1 }
    },
    { ones: 0, zeros: 0 }
  )
  return lastResult.ones >= lastResult.zeros ? 1 : 0
}

const part1 = binaryStrings => {
  const numBits = binaryStrings[0].length
  const bits = range(numBits)
  const lastResult = bits.reduce(
    (acc, bit) => {
      const nextChar = mostCommonBit(binaryStrings, bit) === 1 ? '1' : '0'
      return acc + nextChar
    },
    ''
  )
  const gamma = binaryStringToDecimal(lastResult)
  const epsilon = binaryStringToDecimal(flipBits(lastResult))
  console.log('Answer (part1):', gamma * epsilon)
}

const filterBinaryStrings = (binaryStrings, bit, value) =>
  binaryStrings.filter(binaryString => Number(binaryString[bit]) === value)

const searchBinaryStrings = (binaryStrings, bit, mostCommon) => {
  const value = mostCommon
    ? mostCommonBit(binaryStrings, bit)
    : oppositeValue(mostCommonBit(binaryStrings, bit))
  const binaryStringsFiltered = filterBinaryStrings(binaryStrings, bit, value)
  if (binaryStringsFiltered.length === 1) {
    return binaryStringsFiltered[0]
  }
  return searchBinaryStrings(binaryStringsFiltered, bit + 1, mostCommon)
}

const part2 = binaryStrings => {
  const oxygenGeneratorRating = binaryStringToDecimal(searchBinaryStrings(binaryStrings, 0, true))
  const co2ScrubberRating = binaryStringToDecimal(searchBinaryStrings(binaryStrings, 0, false))
  console.log('Answer (part2):', oxygenGeneratorRating * co2ScrubberRating)
}

const main = async () => {
  const buffer = await fs.readFile('day03/input.txt')
  const binaryStrings = buffer.toString().split('\n').filter(Boolean)
  part1(binaryStrings)
  part2(binaryStrings)
}

main()
