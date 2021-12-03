const fs = require('fs').promises

const range = n => Array.from(Array(n).keys())

const flipBits = binaryString =>
  Array.from(binaryString).map(ch => ch === '1' ? '0' : '1').join('')

const part1 = binaryStrings => {
  const numBits = binaryStrings[0].length
  const lastResult = range(numBits).reduce(
    (acc, bit) => {
      const innerResult = binaryStrings.reduce(
        (acc, binaryString) => {
          const isOne = binaryString[bit] == '1'
          return isOne
            ? { ...acc, ones: acc.ones + 1 }
            : { ...acc, zeros: acc.zeros + 1 }
        },
        { ones: 0, zeros: 0 }
      )
      const nextChar = innerResult.ones > innerResult.zeros ? '1' : '0'
      return acc + nextChar
    },
    ''
  )
  const gamma = parseInt(lastResult, 2)
  const epsilon = parseInt(flipBits(lastResult), 2)
  console.log('Answer (part1): ', gamma * epsilon)
}

const main = async () => {
  const buffer = await fs.readFile('day03/input.txt')
  const binaryStrings = buffer.toString().split('\n').filter(Boolean)
  part1(binaryStrings)
}

main()
