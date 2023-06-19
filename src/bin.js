#!/usr/bin/env node

import { readFileSync } from 'fs'
import { join } from 'path'
import pc from 'picocolors'
import { Program } from './program'

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
  const pathName = join(process.cwd(), pathParam)
  const content = readFileSync(pathName, 'utf-8')
  return content
}

async function main() {
  const stdin = await getStdin()
  return Program({
    args: process.argv.slice(2),
    stdin,
    readFile,
    terminalColors: pc,
  })
}

main()
  .then(console.log)
  .catch(error => {
    console.error(error.stack || error.message)
    process.exitCode = 1
  })
