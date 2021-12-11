const fs = require('fs').promises
const R = require('ramda')

const sum = xs => xs.reduce((a, b) => a + b, 0)

const within = (minInclusive, maxExclusive, v) => v >= minInclusive && v < maxExclusive

function* offsetsGen() {
  const offsets = [-1, 0, 1]
  for (const rowOffset of offsets) {
    for (const colOffset of offsets) {
      if (!(rowOffset === 0 && colOffset === 0)) {
        yield [rowOffset, colOffset]
      }
    }
  }
}

const getNeighbourCoords = (grid, row, col) => {
  const neighboursCoords = []
  for (const [rowOffset, colOffset] of offsetsGen()) {
    const r = row + rowOffset
    const c = col + colOffset
    if (within(0, 10, r) && within(0, 10, c)) {
      neighboursCoords.push({ row: r, col: c, v: grid[r][c] })
    }
  }
  return neighboursCoords
}

const ESC = '\u001B'
const TERM_RESET = `${ESC}[0m`
const TERM_BOLD = `${ESC}[1m`

const dumpGrid = (grid, flashed = []) => {
  const isHighlighted = (row, col) => Boolean(flashed.find(coords => coords.row === row && coords.col === col))
  for (const row of R.range(0, 10)) {
    const vs = grid[row]
    const descriptions = vs.map((v, col) => ({ v, highlighted: isHighlighted(row, col) }))
    const line = descriptions.reduce(
      (acc, desc) => acc + (desc.highlighted ? `${TERM_BOLD}${desc.v}${TERM_RESET}` : desc.v),
      '')
    console.log(line)
  }
  console.log('-'.repeat(10))
}

const step = grid => {
  const flashed = []
  return flashed
}

const part1 = (grid, steps) => {
  dumpGrid(grid)
  const totalFlashed = 0
  for (const _ of R.range(0, steps)) {
    const flashed = step()
    dumpGrid(grid, flashed)
    totalFlashed += flashed.length
  }
  console.log('Answer (part1):', totalFlashed)
}

const main = async () => {
  const buffer = await fs.readFile('day11/example.txt')
  // const buffer = await fs.readFile('day11/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const grid = lines.map(line => Array.from(line).map(Number))
  part1(grid, 1)
}

main()
