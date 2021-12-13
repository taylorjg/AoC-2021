const fs = require('fs').promises
const R = require('ramda')

const part1 = (dots, folds) => {
  console.log('Answer (part1):', 0)
}

const main = async () => {
  const buffer = await fs.readFile('day13/example.txt')
  // const buffer = await fs.readFile('day13/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const splitIndex = lines.findIndex(line => line.startsWith('fold'))
  const dots = lines.slice(0, splitIndex).map(line => {
    const bits = line.split(',')
    return {
      x: Number(bits[0]),
      y: Number(bits[1])
    }
  })
  const folds = lines.slice(splitIndex).map(line => {
    const bits1 = line.split(/\s+/)
    if (bits1.length === 3) {
      const bits2 = bits1[2].split('=')
      if (bits2.length === 2) {
        if (bits2[0] === 'x') {
          return { x: Number(bits2[1]) }
        }
        if (bits2[0] === 'y') {
          return { y: Number(bits2[1]) }
        }
      }
    }
    throw new Error(`failed to parse fold line: ${line}`)
  })
  console.dir(dots)
  console.dir('-'.repeat(80))
  console.dir(folds)
  part1(dots, folds)
}

main()
