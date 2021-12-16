const fs = require('fs').promises
const R = require('ramda')

const sum = xs => xs.reduce((a, b) => a + b, 0)

const intToBinaryString = n => n.toString(2).padStart(4, '0')

const hexCharToInt = hexChar => parseInt(hexChar, 16)

const hexStringToBinaryString = hexString =>
  Array.from(hexString).map(hexChar => intToBinaryString(hexCharToInt(hexChar))).join('')

const parseLiteralPacket = (binaryString, version, typeId) => {
  let numberString = ''
  let currentIndex = 6
  for (; ;) {
    const fiveBits = binaryString.slice(currentIndex, currentIndex + 5)
    currentIndex += 5
    const fourBits = fiveBits.slice(1)
    numberString += fourBits
    if (fiveBits[0] === '0') break
  }
  const literal = parseInt(numberString, 2)
  return { version, typeId, length: currentIndex, literal }
}

const parseOperatorPacket = (binaryString, version, typeId) => {
  const lengthBit = binaryString.slice(6, 7)
  if (lengthBit === '0') {
    const lengthInBits = parseInt(binaryString.slice(7, 7 + 15), 2)
    let remainder = binaryString.slice(7 + 15, 7 + 15 + lengthInBits)
    const packets = []
    for (; ;) {
      const packet = parsePacket(remainder)
      packets.push(packet)
      remainder = remainder.slice(packet.length)
      if (remainder === '') break
    }
    return { version, typeId, length: 7 + 15 + lengthInBits, packets }
  } else {
    let lengthInBits = 0
    let remainder = binaryString.slice(7 + 11)
    const packets = []
    for (; ;) {
      const packet = parsePacket(remainder)
      packets.push(packet)
      lengthInBits += packet.length
      remainder = remainder.slice(packet.length)
      if (remainder === '') break
    }
    return { version, typeId, length: 7 + 11 + lengthInBits, packets }
  }
}

const parsePacket = binaryString => {
  const version = parseInt(binaryString.slice(0, 3), 2)
  const typeId = parseInt(binaryString.slice(3, 6), 2)
  if (typeId === 4) {
    return parseLiteralPacket(binaryString, version, typeId)
  } else {
    return parseOperatorPacket(binaryString, version, typeId)
  }
}

const part1 = hexString => {
  const binaryString = hexStringToBinaryString(hexString)
  const packet = parsePacket(binaryString)
  const versions = []
  const extractVersions = p => {
    const { version, packets = [] } = p
    versions.push(version)
    packets.forEach(extractVersions)
  }
  extractVersions(packet)
  const answer = sum(versions)
  console.log('Answer (part1):', answer)
}

const main = async () => {
  const buffer = await fs.readFile('day16/input.txt')
  const hexString = buffer.toString().split('\n')[0]
  // part1('8A004A801A8002F478')
  // part1('620080001611562C8802118E34')
  // part1('C0015000016115A2E0802F182340')
  // part1('A0016C880162017C3686B18A3D4780')
  part1(hexString)
}

main()
