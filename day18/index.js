const fs = require('fs').promises

const explode = () => {
}

const split = () => {
}

const reduce = number => {
}

const add = (a, b) => {
  const number = { left: a, right: b }
  return reduce(number)
}

const magnitude = number => {
}

const part1 = numbers => {
  console.log('Answer (part1):', 0)
}

const parseNumber = line => {

  const helper = (nodes, s) => {
    const [ch, ...remainder] = s
    switch (ch) {
      case '[': {
        const node = {}
        nodes.push(node)
        const result = helper(nodes, remainder)
        node.left = result.node
        return helper(nodes, result.remainder)
      }
      case ',': {
        const node = nodes[nodes.length - 1]
        const result = helper(nodes, remainder)
        node.right = result.node
        return helper(nodes, result.remainder)
      }
      case ']': {
        const node = nodes.pop()
        return { node, remainder }
      }
      default: {
        const node = Number(ch)
        return { node, remainder }
      }
    }
  }

  const result = helper([], line)
  return result.node
}

const main = async () => {
  const buffer = await fs.readFile('day18/example1.txt')
  // const buffer = await fs.readFile('day18/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const numbers = lines.map(parseNumber)
  console.dir(numbers, { depth: null })
  part1(numbers)
}

main()
