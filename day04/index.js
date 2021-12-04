const fs = require('fs').promises
const R = require('rambda')

const part1 = (numbers, boards) => {
  console.log('Answer (part1):', 0)
}

class Board {
  constructor(lines) {
    this.lines = lines
    this.rows = this.lines.map(line => line.split(/\s+/).map(Number))
    this.cols = R.range(0, 5).map(col => this.rows.map(row => row[col]))
  }
}

const parseLines = lines => {
  const numbers = lines[0].split(',').map(Number)
  const boardsLines = R.splitEvery(5, lines.slice(1))
  const boards = boardsLines.map(xs => new Board(xs))
  return { numbers, boards }
}

const main = async () => {
  const buffer = await fs.readFile('day04/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const { numbers, boards } = parseLines(lines)
  part1(numbers, boards)
}

main()
