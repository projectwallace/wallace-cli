#!/usr/bin/env node

import { readFile as fsReadFile } from 'fs/promises'
import { join } from 'path'
import { styleText } from 'util'
import { Program } from './program'

const pc = {
  bold: str => styleText('bold', str),
  dim: str => styleText('dim', str),
  italic: str => styleText('italic', str),
  underline: str => styleText('underline', str),
  red: str => styleText('red', str),
}

async function get_stdin() {
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

async function read_file(path_param) {
  const pathName = join(process.cwd(), path_param)
  const content = await fsReadFile(pathName, 'utf-8')
  return content
}

async function main() {
  const stdin = await get_stdin()
  return Program({
    args: process.argv.slice(2),
    stdin,
    read_file,
    terminal_colors: pc,
  })
}

main()
  .then(console.log)
  .catch(error => {
    console.error(error.stack || error.message)
    process.exitCode = 1
  })
