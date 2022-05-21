const { readFileSync } = require('fs')
const path = require('path')
const pc = require('picocolors')
const { Program } = require('./program')

async function getStdin() {
  const { stdin } = process
  if (stdin.isTTY) {
    return ''
  }

  let result = ''

  for await (const chunk of stdin) {
    result += chunk.toString()
  }

  return result
}

function readFile(pathParam) {
  const pathName = path.join(process.cwd(), pathParam)
  const content = readFileSync(pathName, 'utf-8')
  return content
}

async function main() {
  const stdIn = await getStdin()
  return Program({
    args: process.argv.slice(2),
    stdIn,
    readFile,
    terminalColors: pc,
  })
}

main()
  .then(result => console.log(result))
  .catch(error => {
    console.error(error.stack || error.message)
    process.exitCode = 1
  })
