const fs = require('fs').promises
const R = require('ramda')

const foldUp = (matrix1, alongY) => {
  const numRows1 = matrix1.length
  const numCols1 = matrix1[0].length
  const numRows2 = Math.floor(numRows1 / 2)
  const numCols2 = numCols1
  const matrix2 = R.range(0, numRows2).map(_ => Array(numCols2).fill(0, 0, numCols2))
  for (const y of R.range(0, numRows2)) {
    for (const x of R.range(0, numCols2)) {
      matrix2[y][x] = matrix1[y][x]
    }
  }
  for (const y of R.range(0, numRows2)) {
    for (const x of R.range(0, numCols2)) {
      if (matrix1[numRows1 - y - 1][x]) {
        matrix2[y][x] = 1
      }
    }
  }
  return matrix2
}

const foldLeft = (matrix1, alongX) => {
  const numRows1 = matrix1.length
  const numCols1 = matrix1[0].length
  const numRows2 = numRows1
  const numCols2 = Math.floor(numCols1 / 2)
  const matrix2 = R.range(0, numRows2).map(_ => Array(numCols2).fill(0, 0, numCols2))
  for (const y of R.range(0, numRows2)) {
    for (const x of R.range(0, numCols2)) {
      matrix2[y][x] = matrix1[y][x]
    }
  }
  for (const y of R.range(0, numRows2)) {
    for (const x of R.range(0, numCols2)) {
      if (matrix1[y][numCols1 - x - 1]) {
        matrix2[y][x] = 1
      }
    }
  }
  return matrix2
}

const countOnes = matrix => {
  const numRows = matrix.length
  const numCols = matrix[0].length
  let ones = 0
  for (const y of R.range(0, numRows)) {
    for (const x of R.range(0, numCols)) {
      if (matrix[y][x]) {
        ones += 1
      }
    }
  }
  return ones
}

const part1 = (dots, folds) => {
  const maxx = Math.max(...dots.map(dot => dot.x))
  const maxy = Math.max(...dots.map(dot => dot.y))
  console.dir({ maxx, maxy })
  const numRows = maxy + 1
  const numCols = maxx + 1
  let matrix = R.range(0, numRows).map(_ => Array(numCols).fill(0, 0, numCols))
  for (const { x, y } of dots) {
    matrix[y][x] = 1
  }
  const fold = folds[0]
  if (fold.y !== undefined) {
    matrix = foldUp(matrix, fold.y)
  } else {
    matrix = foldLeft(matrix, fold.x)
  }
  const ones = countOnes(matrix)
  console.log('Answer (part1):', ones)
}

const part2 = (dots, folds) => {
  const maxx = Math.max(...dots.map(dot => dot.x))
  const maxy = Math.max(...dots.map(dot => dot.y))
  console.dir({ maxx, maxy })
  const numRows = maxy + 1
  const numCols = maxx + 1
  let matrix = R.range(0, numRows).map(_ => Array(numCols).fill(0, 0, numCols))
  for (const { x, y } of dots) {
    matrix[y][x] = 1
  }
  for (const fold of folds) {
    if (fold.y !== undefined) {
      matrix = foldUp(matrix, fold.y)
    } else {
      matrix = foldLeft(matrix, fold.x)
    }
  }

  for (const row of matrix) {
    console.log(row.map(n => n ? 'x' : ' ').join(''))
  }
}

const main = async () => {
  // const buffer = await fs.readFile('day13/example.txt')
  const buffer = await fs.readFile('day13/input.txt')
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
  part1(dots, folds)
  part2(dots, folds)
}

main()
