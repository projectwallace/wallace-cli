#!/usr/bin/env node

import { readFile as fsReadFile } from 'fs/promises'
import { join } from 'path'
import { styleText } from 'util'
import { Program } from './program.js'

const pc = {
	bold: (str: string) => styleText('bold', str),
	dim: (str: string) => styleText('dim', str),
	italic: (str: string) => styleText('italic', str),
	underline: (str: string) => styleText('underline', str),
	red: (str: string) => styleText('red', str),
}

async function get_stdin(): Promise<string> {
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

async function read_file(path_param: string): Promise<string> {
	const pathName = join(process.cwd(), path_param)
	const content = await fsReadFile(pathName, 'utf-8')
	return content
}

async function main(): Promise<string> {
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
	.catch((error: Error) => {
		console.error(error.stack || error.message)
		process.exitCode = 1
	})
