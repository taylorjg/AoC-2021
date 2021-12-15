const fs = require('fs').promises
const R = require('ramda')

const sum = xs => xs.reduce((a, b) => a + b, 0)

const makeKey = (row, col) => `${row}:${col}`

const parseKey = key => {
  const bits = key.split(':')
  return { row: Number(bits[0]), col: Number(bits[1]) }
}

const manhattanDistance = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col)

const reconstructPath = (cameFrom, currentKey) => {
  const totalPath = [currentKey]
  for (; ;) {
    if (!cameFrom.has(currentKey)) break
    currentKey = cameFrom.get(currentKey)
    totalPath.push(currentKey)
  }
  return totalPath.reverse().map(parseKey)
}

const getNeighbours = (key, numRows, numCols) => {
  const { row, col } = parseKey(key)
  const offsets = [[-1, 0], [+1, 0], [0, -1], [0, +1]]
  const ns = []
  for (const [rowOffset, colOffset] of offsets) {
    const r = row + rowOffset
    const c = col + colOffset
    if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
      ns.push({ row: r, col: c })
    }
  }
  return ns
}

const A_star = (numRows, numCols, gridLookup, start, goal) => {
  const startKey = makeKey(start.row, start.col)
  const goalKey = makeKey(goal.row, goal.col)
  const openSet = new Set([startKey])
  const cameFrom = new Map()
  const gScores = new Map([[startKey, 0]])
  const gScoresGet = k => gScores.get(k) ?? Number.MAX_SAFE_INTEGER
  const fScores = new Map([[startKey, manhattanDistance(start, goal)]])
  const fScoresGet = k => fScores.get(k) ?? Number.MAX_SAFE_INTEGER

  for (; ;) {
    if (openSet.length === 0) break
    const openSetWithScores = Array.from(openSet.values()).map(k => ({ k, f: fScoresGet(k) }))
    openSetWithScores.sort((a, b) => a.f - b.f)
    const currentKey = R.head(openSetWithScores).k
    if (currentKey === goalKey) {
      return reconstructPath(cameFrom, currentKey)
    }

    openSet.delete(currentKey)
    for (const n of getNeighbours(currentKey, numRows, numCols)) {
      const nkey = makeKey(n.row, n.col)
      const gScore = gScoresGet(currentKey)
      const weight = gridLookup(n)
      const tentativeScoreNeighbour = gScore + weight
      const currentScoreNeighbour = gScoresGet(nkey)
      if (tentativeScoreNeighbour < currentScoreNeighbour) {
        cameFrom.set(nkey, currentKey)
        gScores.set(nkey, tentativeScoreNeighbour)
        const hScore = manhattanDistance(n, goal)
        fScores.set(nkey, tentativeScoreNeighbour + hScore)
        openSet.add(nkey)
      }
    }
  }

  return null
}

const part1 = grid => {
  const numRows = grid.length
  const numCols = grid[0].length
  const START = { row: 0, col: 0 }
  const GOAL = { row: numRows - 1, col: numCols - 1 }
  const gridLookup = location => grid[location.row][location.col]
  const path = A_star(numRows, numCols, gridLookup, START, GOAL)
  console.dir(path)
  const values = path.map(gridLookup)
  console.dir(values)
  const answer = sum(values.slice(1))
  console.log('Answer (part1):', answer)
}

const part2 = grid => {
  const TILES = 5
  const numRows = grid.length
  const numCols = grid[0].length
  const numTiledRows = numRows * TILES
  const numTiledCols = numCols * TILES
  const START = { row: 0, col: 0 }
  const GOAL = { row: numTiledRows - 1, col: numTiledCols - 1 }
  const gridLookup = location => {
    const { row, col } = location
    const modRow = row % numRows
    const modCol = col % numCols
    const originalValue = grid[modRow][modCol]
    const tileRow = Math.floor(row / numRows)
    const tileCol = Math.floor(col / numCols)
    const d = tileRow + tileCol
    const incrementedValue = originalValue + d
    return incrementedValue <= 9 ? incrementedValue : incrementedValue - 9
  }
  const path = A_star(numTiledRows, numTiledCols, gridLookup, START, GOAL)
  console.dir(path)
  const values = path.map(gridLookup)
  console.dir(values)
  const answer = sum(values.slice(1))
  console.log('Answer (part2):', answer)
}

const main = async () => {
  // const buffer = await fs.readFile('day15/example.txt')
  const buffer = await fs.readFile('day15/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const grid = lines.map(line => Array.from(line).map(Number))
  part1(grid)
  part2(grid)
}

main()
