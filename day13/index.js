const fs = require('fs').promises
const R = require('ramda')

const sum = xs => xs.reduce((a, b) => a + b, 0)

const getDimensions = dots => {
  const maxx = Math.max(...dots.map(dot => dot.x))
  const maxy = Math.max(...dots.map(dot => dot.y))
  const numRows = maxy + 1
  const numCols = maxx + 1
  return { numRows, numCols }
}

const initMatrixFromDimensions = (numRows, numCols) =>
  matrix = R.range(0, numRows).map(_ => Array(numCols).fill(0, 0, numCols))

const initMatrixFromDots = dots => {
  const { numRows, numCols } = getDimensions(dots)
  const matrix = initMatrixFromDimensions(numRows, numCols)
  for (const { x, y } of dots) {
    matrix[y][x] = 1
  }
  return matrix
}

const foldUp = matrixIn => {
  const numRowsIn = matrixIn.length
  const numColsIn = matrixIn[0].length
  const numRowsOut = Math.floor(numRowsIn / 2)
  const numColsOut = numColsIn
  const matrixOut = initMatrixFromDimensions(numRowsOut, numColsOut)
  for (const y of R.range(0, numRowsOut)) {
    for (const x of R.range(0, numColsOut)) {
      matrixOut[y][x] = matrixIn[y][x]
      if (matrixIn[numRowsIn - y - 1][x]) {
        matrixOut[y][x] = 1
      }
    }
  }
  return matrixOut
}

const foldLeft = matrixIn => {
  const numRowsIn = matrixIn.length
  const numColsIn = matrixIn[0].length
  const numRowsOut = numRowsIn
  const numColsOut = Math.floor(numColsIn / 2)
  const matrixOut = initMatrixFromDimensions(numRowsOut, numColsOut)
  for (const y of R.range(0, numRowsOut)) {
    for (const x of R.range(0, numColsOut)) {
      matrixOut[y][x] = matrixIn[y][x]
      if (matrixIn[y][numColsIn - x - 1]) {
        matrixOut[y][x] = 1
      }
    }
  }
  return matrixOut
}

const countOnes = matrix =>
  sum(matrix.map(row => row.filter(Boolean).length))

const applyFolds = (initialMatrix, folds) =>
  folds.reduce(
    (previousMatrix, fold) => (fold.y ? foldUp : foldLeft)(previousMatrix),
    initialMatrix
  )

const dumpMatrix = matrix => {
  for (const row of matrix) {
    console.log(row.map(n => n ? 'o' : ' ').join(''))
  }
}

const part1 = (dots, folds) => {
  const initialMatrix = initMatrixFromDots(dots)
  const finalMatrix = applyFolds(initialMatrix, folds.slice(0, 1))
  console.log('Answer (part1):', countOnes(finalMatrix))
}

const part2 = (dots, folds) => {
  const initialMatrix = initMatrixFromDots(dots)
  const finalMatrix = applyFolds(initialMatrix, folds)
  dumpMatrix(finalMatrix)
}

const parseDot = line => {
  const bits = line.split(',')
  return {
    x: Number(bits[0]),
    y: Number(bits[1])
  }
}

const parseFold = line => {
  const bits1 = line.split(/\s+/)
  const bits2 = bits1[2].split('=')
  if (bits2[0] === 'x') {
    return { x: Number(bits2[1]) }
  }
  if (bits2[0] === 'y') {
    return { y: Number(bits2[1]) }
  }
}

const main = async () => {
  // const buffer = await fs.readFile('day13/example.txt')
  const buffer = await fs.readFile('day13/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const splitIndex = lines.findIndex(line => line.startsWith('fold'))
  const dots = lines.slice(0, splitIndex).map(parseDot)
  const folds = lines.slice(splitIndex).map(parseFold)
  part1(dots, folds)
  part2(dots, folds)
}

main()
