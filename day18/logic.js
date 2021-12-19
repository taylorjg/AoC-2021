const isRoot = n => !n.parent
const isRegular = n => Number.isInteger(n)
const isNode = n => !isRegular(n)

const findRoot = n => isRoot(n) ? n : findRoot(n.parent)

const listNodesWithRegulars = root => {
  const regulars = []
  const helper = (n, p) => {
    if (isRegular(n)) {
      const len = regulars.length
      if (len === 0 || p !== regulars[len - 1]) {
        regulars.push(p)
      }
      return
    }
    if (isNode(n)) {
      helper(n.left, n)
      helper(n.right, n)
    }
  }
  helper(root)
  return regulars
}

const findLeftRegular = n => {
  const root = findRoot(n)
  const regulars = listNodesWithRegulars(root)
  const index = regulars.findIndex(m => m === n)
  if (index < 1) return null
  return regulars[index - 1]
}

const findRightRegular = n => {
  const root = findRoot(n)
  const regulars = listNodesWithRegulars(root)
  const index = regulars.findIndex(m => m === n)
  if (index < 0 || index >= regulars.length - 1) return null
  return regulars[index + 1]
}

const explode = number => {

  const leftNodeWithRegular = findLeftRegular(number)
  const rightNodeWithRegular = findRightRegular(number)

  if (leftNodeWithRegular) {
    if (isRegular(leftNodeWithRegular.right)) {
      leftNodeWithRegular.right += number.left
    } else {
      leftNodeWithRegular.left += number.left
    }
  }

  if (rightNodeWithRegular) {
    if (isRegular(rightNodeWithRegular.left)) {
      rightNodeWithRegular.left += number.right
    } else {
      rightNodeWithRegular.right += number.right
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
    if (isRegular(n)) return null
    if (level === 4) return n
    const n2 = helper(n.left, level + 1)
    if (n2) return n2
    const n3 = helper(n.right, level + 1)
    if (n3) return n3
    return null
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
      const nodesWithRegulars = listNodesWithRegulars(number)
      const firstBigRegular = nodesWithRegulars.find(n => (
        (isRegular(n.left) && n.left >= 10) ||
        (isRegular(n.right) && n.right >= 10)
      ))
      if (firstBigRegular) {
        if (isRegular(firstBigRegular.left) && firstBigRegular.left >= 10) {
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
    if (isRegular(n)) {
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
  isRegular,
  isNode,
  explode,
  reduce,
  add,
  magnitude
}
