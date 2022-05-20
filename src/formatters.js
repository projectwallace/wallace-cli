export function toNumber(number, { decimals = 3 } = {}) {
  return Number.isInteger(number)
    ? new Intl.NumberFormat().format(number)
    : number === 0 ? 0 : parseFloat(number).toFixed(decimals);
}

export function toPercentage(number) {
  return String(parseFloat(number * 100).toFixed(1)) + '%'
}

function strLength(str) {
  // Basically strip ansi-characters from the string
  // source: https://github.com/usmanyunusov/nanospinner/blob/a80396e2f2613462399d39e664a690ec31a0da3f/index.js#L9
  return str
    .replace(/\u001b[^m]*?m/g, '')
    .length
}

export function padEnd(str, padLength, padString) {
  const length = strLength(str)
  return str + ''.padEnd(padLength - length, padString)
}

export function padStart(str, padLength, padString) {
  const length = strLength(str)
  return ''.padStart(padLength - length, padString) + str
}