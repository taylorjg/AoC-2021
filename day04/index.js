const fs = require('fs').promises
const R = require('ramda')

const sum = xs => xs.reduce((a, b) => a + b, 0)

class Board {
  constructor(lines) {
    const rowsOfNumbers = lines.map(line => line.split(/\s+/).map(Number))
    const colsOfNumbers = R.range(0, 5).map(col => rowsOfNumbers.map(row => row[col]))
    this.rowsOfCells = rowsOfNumbers.map(rowOfNumbers => rowOfNumbers.map(number => ({ number, marked: false })))
    this.colsOfCells = colsOfNumbers.map(colOfNumbers => colOfNumbers.map(number => ({ number, marked: false })))
  }

  reset() {
    for (const rowOfCells of this.rowsOfCells) {
      for (const cell of rowOfCells) {
        cell.marked = false
      }
    }
    for (const colOfCells of this.colsOfCells) {
      for (const cell of colOfCells) {
        cell.marked = false
      }
    }

  }

  markOff(number) {
    for (const rowOfCells of this.rowsOfCells) {
      for (const cell of rowOfCells) {
        if (cell.number === number) {
          cell.marked = true
        }
      }
    }
    for (const colOfCells of this.colsOfCells) {
      for (const cell of colOfCells) {
        if (cell.number === number) {
          cell.marked = true
        }
      }
    }
  }

  get won() {
    for (const rowOfCells of this.rowsOfCells) {
      if (rowOfCells.every(cell => cell.marked)) {
        return true
      }
    }
    for (const colOfCells of this.colsOfCells) {
      if (colOfCells.every(cell => cell.marked)) {
        return true
      }
    }
    return false
  }

  get unmarkedNumbers() {
    const numbers = []
    for (const rowOfCells of this.rowsOfCells) {
      for (const cell of rowOfCells) {
        if (!cell.marked) {
          numbers.push(cell.number)
        }
      }
    }
    return numbers
  }
}

const parseLines = lines => {
  const numbers = lines[0].split(',').map(Number)
  const boardsLines = R.splitEvery(5, lines.slice(1))
  const boards = boardsLines.map(xs => new Board(xs))
  return { numbers, boards }
}

const part1 = (numbers, boards) => {
  for (const number of numbers) {
    for (const board of boards) {
      board.markOff(number)
      if (board.won) {
        console.log('Answer (part1):', sum(board.unmarkedNumbers) * number)
        return
      }
    }
  }
}

const part2 = (numbers, boards) => {
  let remainingBoards = boards
  for (const number of numbers) {
    for (const board of remainingBoards) {
      board.markOff(number)
    }
    const remainingBoards2 = remainingBoards.filter(board => !board.won)
    if (remainingBoards.length === 1 && remainingBoards2.length === 0) {
      const board = remainingBoards[0]
      console.log('Answer (part2):', sum(board.unmarkedNumbers) * number)
    }
    remainingBoards = remainingBoards2
  }
}

const main = async () => {
  const buffer = await fs.readFile('day04/input.txt')
  const lines = buffer.toString().split('\n').map(s => s.trim()).filter(Boolean)
  const { numbers, boards } = parseLines(lines)
  part1(numbers, boards)
  for (const board of boards) { board.reset() }
  part2(numbers, boards)
}

main()
