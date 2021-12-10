const fs = require('fs').promises
const R = require('ramda')

const sum = xs => xs.reduce((a, b) => a + b, 0)

const within = (minInclusive, maxExclusive, v) => v >= minInclusive && v < maxExclusive

const part1 = (heightmap) => {

  const numRows = heightmap.length
  const numCols = heightmap[0].length

  const getNeighboursCoords = (row, col) => {
    const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    const neighboursCoords = []
    for (const [rowOffset, colOffset] of offsets) {
      const r = row + rowOffset
      const c = col + colOffset
      if (within(0, numRows, r) && within(0, numCols, c)) {
        neighboursCoords.push({ row: r, col: c })
      }
    }
    return neighboursCoords
  }

  const lowpoints = []
  for (const row of R.range(0, numRows)) {
    for (const col of R.range(0, numCols)) {
      const neighboursCoords = getNeighboursCoords(row, col)
      const v = heightmap[row][col]
      const isLowpoint = neighboursCoords.every(({ row: r, col: c }) => v < heightmap[r][c])
      if (isLowpoint) {
        lowpoints.push({ row, col, v })
      }
    }
  }
  console.dir(lowpoints)
  const answer = sum(lowpoints.map(({ v }) => v + 1))
  console.log('Answer (part1):', answer)
}

const main = async () => {
  // const buffer = await fs.readFile('day09/example.txt')
  const buffer = await fs.readFile('day09/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const heightmap = lines.map(line => Array.from(line).map(Number))
  part1(heightmap)
}

main()
