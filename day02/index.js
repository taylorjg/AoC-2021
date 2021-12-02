const fs = require('fs').promises

const parseCommand = rawCommand => {
  const bits = rawCommand.split(/\s/).map(s => s.trim())
  const value = Number(bits[1])
  return { direction: bits[0], value }
}

const part1 = commands => {
  const lastResult = commands.reduce(
    (acc, command) => {
      switch (command.direction) {
        case 'up': return { ...acc, depth: acc.depth - command.value }
        case 'down': return { ...acc, depth: acc.depth + command.value }
        case 'forward': return { ...acc, position: acc.position + command.value }
      }
    },
    { position: 0, depth: 0 })
  console.log('Answer (part1): ', lastResult.position * lastResult.depth)
}

const part2 = commands => {
  const lastResult = commands.reduce(
    (acc, command) => {
      switch (command.direction) {
        case 'up': return { ...acc, aim: acc.aim - command.value }
        case 'down': return { ...acc, aim: acc.aim + command.value }
        case 'forward': return {
          ...acc,
          position: acc.position + command.value,
          depth: acc.depth + acc.aim * command.value
        }
      }
    },
    { position: 0, depth: 0, aim: 0 })
  console.log('Answer (part2): ', lastResult.position * lastResult.depth)
}

const main = async () => {
  const buffer = await fs.readFile('day02/input.txt')
  const commands = buffer.toString().split('\n').filter(Boolean).map(parseCommand)
  part1(commands)
  part2(commands)
}

main()
