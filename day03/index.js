const fs = require('fs').promises

const range = n => Array.from(Array(n).keys())

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
  return lastResult.ones > lastResult.zeros ? 1 : 0
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

const main = async () => {
  const buffer = await fs.readFile('day03/input.txt')
  const binaryStrings = buffer.toString().split('\n').filter(Boolean)
  part1(binaryStrings)
}

main()
