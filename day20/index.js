const fs = require('fs').promises
const R = require('ramda')

const sum = xs => xs.reduce((a, b) => a + b, 0)

function* offsetsGen() {
  const offsets = [-1, 0, 1]
  for (const rowOffset of offsets) {
    for (const colOffset of offsets) {
      yield [rowOffset, colOffset]
    }
  }
}

const OFFSETS = Array.from(offsetsGen())

const processImage = (algorithm, inputImage) => {

  const numRows = inputImage.length
  const numCols = inputImage[0].length

  const getSquare = (row, col) => {
    const values = OFFSETS.map(([rowOffset, colOffset]) => {
      const r = row + rowOffset
      const c = col + colOffset
      if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
        return inputImage[r][c]
      }
      return 0
    })
    return values
  }

  const numRowsOut = numRows + 2
  const numColsOut = numCols + 2

  const outputImage = R.range(0, numRowsOut).map(_ => Array(numColsOut))

  for (const row of R.range(0, numRowsOut)) {
    for (const col of R.range(0, numColsOut)) {
      const square = getSquare(row - 1, col - 1)
      const binaryString = square.join('')
      const index = parseInt(binaryString, 2)
      const value = algorithm[index]
      outputImage[row][col] = value
    }
  }

  return outputImage
}

const countOnes = image =>
  sum(image.map(row => row.filter(Boolean).length))

const part1 = (algorithm, inputImage) => {
  // console.dir(inputImage)
  // console.log('-'.repeat(20))
  const outputImage1 = processImage(algorithm, inputImage)
  // console.dir(outputImage1)
  // console.log('-'.repeat(20))
  const outputImage2 = processImage(algorithm, outputImage1)
  // console.dir(outputImage2)
  const answer = countOnes(outputImage2)
  console.log('Answer (part1):', answer)
}

const main = async () => {
  const buffer = await fs.readFile('day20/example.txt')
  // const buffer = await fs.readFile('day20/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const [algorithmLine, ...imageLines] = lines
  const algorithm = Array.from(algorithmLine).map(ch => ch === '#' ? 1 : 0)
  const image = imageLines.map(line => Array.from(line).map(ch => ch === '#' ? 1 : 0))

  // 5026 too high
  part1(algorithm, image)
}

main()
