const sum = xs => xs.reduce((a, b) => a + b, 0)

function* deterministicDieGen() {
  let n = 1
  for (; ;) {
    const rolls = [n++, n++, n++]
    yield rolls
  }
}

const part1 = (p1Start, p2Start) => {
  const die = deterministicDieGen()
  let player1Position = p1Start
  let player2Position = p2Start
  let player1Score = 0
  let player2Score = 0
  let dieRolls = 0
  let turn = 1
  for (; ;) {
    const rolls = die.next().value
    dieRolls += 3
    const total = sum(rolls)
    if (turn === 1) {
      turn = 2
      player1Position = ((player1Position - 1 + total) % 10) + 1
      player1Score += player1Position
      if (player1Score >= 1000) {
        const answer = player2Score * dieRolls
        console.log('Answer (part1):', answer)
        break
      }
    } else {
      turn = 1
      player2Position = ((player2Position - 1 + total) % 10) + 1
      player2Score += player2Position
      if (player2Score >= 1000) {
        const answer = player1Score * dieRolls
        console.log('Answer (part1):', answer)
        break
      }
    }
  }
}

const main = () => {
  part1(4, 8)
  part1(6, 9)
}

main()
