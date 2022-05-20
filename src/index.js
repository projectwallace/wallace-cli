import { readFile as fsReadFile } from 'fs/promises'
import * as path from 'path'
import getStdin from 'get-stdin'
import pc from 'picocolors'
import { Program } from './program.js'

async function readFile(pathParam) {
  const pathName = path.join(process.cwd(), pathParam)
  const content = await fsReadFile(pathName, 'utf-8')
  return content
}

async function main() {
  const stdIn = await getStdin()
  const result = await Program({
    args: process.argv.slice(2),
    stdIn,
    readFile,
    terminalColors: pc,
  })
  console.log(result)
}

main()
  .catch(error => {
    process.exitCode = 1
    console.error(error)
  })
