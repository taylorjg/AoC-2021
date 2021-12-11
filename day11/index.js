const fs = require('fs').promises
const R = require('ramda')

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
const TERM_MAGENTA = `${ESC}[35m`

const dumpGrid = (grid, flashed = []) => {
  const isHighlighted = (row, col) => Boolean(flashed.find(coords => coords.row === row && coords.col === col))
  for (const row of R.range(0, 10)) {
    const vs = grid[row]
    const descriptions = vs.map((v, col) => ({ v, highlighted: isHighlighted(row, col) }))
    const line = descriptions.reduce(
      (acc, desc) => acc + (desc.highlighted ? `${TERM_MAGENTA}${desc.v}${TERM_RESET}` : desc.v),
      '')
    console.log(line)
  }
}

const makeKey = (row, col) => `${row}:${col}`

const parseKey = key => {
  const bits = key.split(':')
  return { row: Number(bits[0]), col: Number(bits[1]) }
}

const step = grid => {

  const flashed = new Set()

  for (const row of R.range(0, 10)) {
    for (const col of R.range(0, 10)) {
      grid[row][col] += 1
    }
  }

  for (; ;) {
    let flashedCountThisIter = 0
    for (const row of R.range(0, 10)) {
      for (const col of R.range(0, 10)) {
        if (grid[row][col] > 9) {
          const key = makeKey(row, col)
          if (!flashed.has(key)) {
            flashed.add(key)
            flashedCountThisIter += 1
            const ns = getNeighbourCoords(grid, row, col)
            for (const n of ns) {
              grid[n.row][n.col] += 1
            }
          }
        }
      }
    }
    if (flashedCountThisIter === 0) break
  }

  const flashedArray = Array.from(flashed).map(parseKey)

  for (const { row, col } of flashedArray) {
    grid[row][col] = 0
  }

  return flashedArray
}

const part1 = (grid, steps) => {
  let totalFlashed = 0
  let lastStepIndex = steps - 1
  for (const stepIndex of R.range(0, steps)) {
    const flashed = step(grid)
    if (stepIndex === lastStepIndex) {
      console.log('Final grid:')
      dumpGrid(grid, flashed)
    }
    totalFlashed += flashed.length
  }
  console.log('Answer (part1):', totalFlashed)
}

const part2 = grid => {
  let steps = 0
  for (; ;) {
    steps += 1
    const flashed = step(grid)
    if (flashed.length === 100) {
      console.log('Final grid:')
      dumpGrid(grid, flashed)
      break
    }
  }
  console.log('Answer (part2):', steps)
}

const main = async () => {
  // const buffer = await fs.readFile('day11/example.txt')
  const buffer = await fs.readFile('day11/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const grid = lines.map(line => Array.from(line).map(Number))
  part1(grid, 100)
  const grid2 = lines.map(line => Array.from(line).map(Number))
  part2(grid2)
}

main()
