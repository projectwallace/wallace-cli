let number_formatter = new Intl.NumberFormat()

/**
 * Format byte size to a human readable size, like 100KB
 * @param {number} number
 * @param {number} decimals
 * @returns {string}
 * @see https://www.codexworld.com/how-to/convert-file-size-bytes-kb-mb-gb-javascript/
 */
export function to_filesize(bytes) {
  if (bytes == 0) return '0B'
  const sizes = ['B', 'KB', 'MB']
  const step = 1000
  const magnitude = Math.floor(Math.log(bytes) / Math.log(step))
  return parseFloat((bytes / Math.pow(step, magnitude)).toFixed(1)) + sizes[magnitude]
}

export function to_number(number, { decimals = 2 } = {}) {
  return Number.isInteger(number)
    ? number_formatter.format(number)
    : number === 0 ? 0 : parseFloat(number).toFixed(decimals)
}

export function to_percentage(number) {
  return String(parseFloat(number * 100).toFixed(1)) + '%'
}

export function pad_end(str, padLength, padString) {
  return str + ''.padEnd(padLength - str.length, padString)
}

export function pad_start(str, padLength, padString) {
  return ''.padStart(padLength - str.length, padString) + str
}
