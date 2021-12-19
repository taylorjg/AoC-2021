const isRoot = n => !n.parent
const isRegularNumber = n => Number.isInteger(n)
const isNode = n => !isRegularNumber(n)

const findRoot = n => isRoot(n) ? n : findRoot(n.parent)

const listNodesWithRegularNumbers = root => {
  const nodesWithRegularNumbers = []
  const helper = (n, p) => {
    if (isRegularNumber(n)) {
      const len = nodesWithRegularNumbers.length
      if (len === 0 || p !== nodesWithRegularNumbers[len - 1]) {
        nodesWithRegularNumbers.push(p)
      }
      return
    }
    if (isNode(n)) {
      helper(n.left, n)
      helper(n.right, n)
    }
  }
  helper(root)
  return nodesWithRegularNumbers
}

const findLeftNodeRegularNumber = n => {
  const root = findRoot(n)
  const nodesWithRegularNumbers = listNodesWithRegularNumbers(root)
  const index = nodesWithRegularNumbers.findIndex(node => node === n)
  if (index < 1) return null
  return nodesWithRegularNumbers[index - 1]
}

const findRightNodeRegularNumber = n => {
  const root = findRoot(n)
  const nodesWithRegularNumbers = listNodesWithRegularNumbers(root)
  const index = nodesWithRegularNumbers.findIndex(node => node === n)
  if (index < 0 || index >= nodesWithRegularNumbers.length - 1) return null
  return nodesWithRegularNumbers[index + 1]
}

const explode = number => {

  const leftNodeWithRegularNumber = findLeftNodeRegularNumber(number)
  const rightNodeWithRegularNumber = findRightNodeRegularNumber(number)

  if (leftNodeWithRegularNumber) {
    if (isRegularNumber(leftNodeWithRegularNumber.right)) {
      leftNodeWithRegularNumber.right += number.left
    } else {
      leftNodeWithRegularNumber.left += number.left
    }
  }

  if (rightNodeWithRegularNumber) {
    if (isRegularNumber(rightNodeWithRegularNumber.left)) {
      rightNodeWithRegularNumber.left += number.right
    } else {
      rightNodeWithRegularNumber.right += number.right
    }
  }

  if (number.parent) {
    if (number.parent.left === number) {
      number.parent.left = 0
    } else {
      if (number.parent.right === number) {
        number.parent.right = 0
      }
    }
  }
}

const splitLeft = n => {
  const left = Math.floor(n.left / 2)
  const right = Math.ceil(n.left / 2)
  n.left = { parent: n, left, right }
}

const splitRight = n => {
  const left = Math.floor(n.right / 2)
  const right = Math.ceil(n.right / 2)
  n.right = { parent: n, left, right }
}

const findFirstLevel4Node = root => {
  const helper = (n, level) => {
    if (isRegularNumber(n)) return null
    if (level === 4) return n
    return helper(n.left, level + 1) || helper(n.right, level + 1)
  }
  return helper(root, 0)
}

const reduce = number => {
  for (; ;) {
    let reduced = false
    const firstLevel4Node = findFirstLevel4Node(number)
    if (firstLevel4Node) {
      explode(firstLevel4Node)
      reduced = true
    } else {
      const nodesWithRegulars = listNodesWithRegularNumbers(number)
      const firstBigRegular = nodesWithRegulars.find(n => (
        (isRegularNumber(n.left) && n.left >= 10) ||
        (isRegularNumber(n.right) && n.right >= 10)
      ))
      if (firstBigRegular) {
        if (isRegularNumber(firstBigRegular.left) && firstBigRegular.left >= 10) {
          splitLeft(firstBigRegular)
        } else {
          splitRight(firstBigRegular)
        }
        reduced = true
      }
    }
    if (!reduced) break
  }
}

const add = (a, b) => {
  const c = { left: a, right: b }
  c.left.parent = c
  c.right.parent = c
  reduce(c)
  return c
}

const magnitude = number => {
  if (Number.isInteger(number)) return number
  return 3 * magnitude(number.left) + 2 * magnitude(number.right)
}

const parseNumber = line => {

  const helper = (nodes, s) => {
    const [ch, ...remainder] = s
    switch (ch) {
      case '[': {
        const node = {}
        if (nodes.length) {
          node.parent = nodes[nodes.length - 1]
        }
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

const formatNumber = n => {
  let s = ''
  const helper = n => {
    if (isRegularNumber(n)) {
      s += n
    } else {
      s += '['
      helper(n.left)
      s += ','
      helper(n.right)
      s += ']'
    }
  }
  helper(n)
  return s
}

module.exports = {
  parseNumber,
  formatNumber,
  isRoot,
  isRegular: isRegularNumber,
  isNode,
  explode,
  reduce,
  add,
  magnitude
}
