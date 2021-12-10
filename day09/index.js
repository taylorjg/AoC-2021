const fs = require('fs').promises
const R = require('ramda')

const sum = xs => xs.reduce((a, b) => a + b, 0)
const product = xs => xs.reduce((a, b) => a * b, 1)

const within = (minInclusive, maxExclusive, v) => v >= minInclusive && v < maxExclusive

const configureGetNeighboursCoords = heightmap => {
  const numRows = heightmap.length
  const numCols = heightmap[0].length
  return (row, col) => {
    const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    const neighboursCoords = []
    for (const [rowOffset, colOffset] of offsets) {
      const r = row + rowOffset
      const c = col + colOffset
      if (within(0, numRows, r) && within(0, numCols, c)) {
        neighboursCoords.push({ row: r, col: c, v: heightmap[r][c] })
      }
    }
    return neighboursCoords
  }
}

const findLowpoints = heightmap => {

  const getNeighboursCoords = configureGetNeighboursCoords(heightmap)

  const numRows = heightmap.length
  const numCols = heightmap[0].length
  const lowpoints = []

  for (const row of R.range(0, numRows)) {
    for (const col of R.range(0, numCols)) {
      const v = heightmap[row][col]
      const ns = getNeighboursCoords(row, col)
      const isLowpoint = ns.every(n => v < n.v)
      if (isLowpoint) {
        lowpoints.push({ row, col, v })
      }
    }
  }

  return lowpoints
}

const part1 = heightmap => {
  const lowpoints = findLowpoints(heightmap)
  const answer = sum(lowpoints.map(({ v }) => v + 1))
  console.log('Answer (part1):', answer)
}

const findBasin = (heightmap, lowpoint) => {

  const getNeighboursCoords = configureGetNeighboursCoords(heightmap)

  const makeKey = ({ row, col }) => `${row}:${col}`
  const seen = new Set([makeKey(lowpoint)])
  const queue = [lowpoint]
  const basin = [lowpoint]

  for (; ;) {
    if (queue.length === 0) break
    const current = queue.shift()
    const { row, col } = current
    const ns = getNeighboursCoords(row, col)
    for (const n of ns) {
      const k = makeKey(n)
      if (!seen.has(k)) {
        seen.add(k)
        if (n.v < 9) {
          basin.push(n)
          queue.push(n)
        }
      }
    }
  }

  return basin
}

const part2 = heightmap => {
  const lowpoints = findLowpoints(heightmap)
  const basins = lowpoints.map(lowpoint => findBasin(heightmap, lowpoint))
  const basinSizes = basins.map(basin => basin.length)
  const basinSizesSorted = basinSizes.sort((a, b) => b - a)
  const top3 = basinSizesSorted.slice(0, 3)
  const answer = product(top3)
  console.log('Answer (part2):', answer)
}

const main = async () => {
  // const buffer = await fs.readFile('day09/example.txt')
  const buffer = await fs.readFile('day09/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const heightmap = lines.map(line => Array.from(line).map(Number))
  part1(heightmap)
  part2(heightmap)
}

main()
