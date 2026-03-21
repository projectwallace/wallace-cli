import { describe, it, expect } from 'vitest'
import fs from 'node:fs/promises'
import { Program } from './program.js'
import { help } from './help.js'

const [css_fixture, cli_fixture, result_json] = await Promise.all([
	fs.readFile('./src/__fixtures__/small.css', 'utf-8'),
	fs.readFile('./src/__fixtures__/small.txt', 'utf-8'),
	fs.readFile('./src/__fixtures__/small.json', 'utf-8'),
])
const result = JSON.parse(result_json)

const terminal_colors = {
	bold: (str: string) => str,
	dim: (str: string) => str,
	underline: (str: string) => str,
	italic: (str: string) => str,
}

describe('Program', () => {
	it('wallace (no stdIn + no args)', async () => {
		const actual = await Program({
			args: [],
			read_file: () => Promise.resolve(''),
			terminal_colors,
			stdin: '',
		})
		const expected = help(terminal_colors)

		expect(actual).toBe(expected)
	})

	it('cat style.css | wallace --help', async () => {
		const actual = await Program({
			args: ['--help'],
			read_file: () => Promise.resolve(''),
			terminal_colors: terminal_colors,
			stdin: css_fixture,
		})
		const expected = help(terminal_colors)

		expect(actual).toBe(expected)
	})

	it('wallace style.css --help', async () => {
		const actual = await Program({
			args: ['style.css', '--help'],
			read_file: () => Promise.resolve(css_fixture),
			terminal_colors: terminal_colors,
			stdin: '',
		})
		const expected = help(terminal_colors)

		expect(actual).toBe(expected)
	})

	it('cat style.css | wallace -h', async () => {
		const actual = await Program({
			args: ['-h'],
			read_file: () => Promise.resolve(''),
			terminal_colors: terminal_colors,
			stdin: css_fixture,
		})
		const expected = help(terminal_colors)

		expect(actual).toBe(expected)
	})

	it('wallace style.css -h', async () => {
		const actual = await Program({
			args: ['style.css', '-h'],
			read_file: () => Promise.resolve(css_fixture),
			terminal_colors: terminal_colors,
			stdin: '',
		})
		const expected = help(terminal_colors)

		expect(actual).toBe(expected)
	})

	it('cat style.css | wallace', async () => {
		const actual = await Program({
			args: [],
			read_file: () => Promise.resolve(''),
			terminal_colors,
			stdin: css_fixture,
		})

		expect(actual).toBe(cli_fixture.trim())
	})

	it('cat style.css | wallace --json', async () => {
		const actual = await Program({
			args: ['--json'],
			read_file: () => Promise.resolve(''),
			terminal_colors,
			stdin: css_fixture,
		})

		expect(JSON.parse(actual)).toEqual(result)
	})

	it('wallace non-existing.css', async () => {
		await expect(
			Program({
				args: ['non-existing.css'],
				read_file: () => Promise.reject(new Error()),
				terminal_colors,
				stdin: '',
			}),
		).rejects.toThrow(Error)
	})

	it('wallace style.css', async () => {
		const actual = await Program({
			args: ['style.css'],
			read_file: () => Promise.resolve(css_fixture),
			terminal_colors,
			stdin: '',
		})

		expect(actual).toBe(cli_fixture.trim())
	})

	it('wallace style.css --json', async () => {
		const actual = await Program({
			args: ['style.css', '--json'],
			read_file: () => Promise.resolve(css_fixture),
			terminal_colors,
			stdin: '',
		})

		expect(JSON.parse(actual)).toEqual(result)
	})
})
