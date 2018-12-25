const test = require('ava')
const execa = require('execa')
const fs = require('fs')
const {promisify} = require('util')
const readFile = promisify(fs.readFile)

test(`it shows a compact table if the --compact option is passed`, async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['--compact'], {
			input: 'a{}'
		}),
		readFile('./test/option-compact/expected.txt', {
			encoding: 'utf8'
		})
	])

	t.deepEqual(actual, expected)
})

test(`it shows a compact table if the -c option is passed`, async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['-c'], {
			input: 'a{}'
		}),
		readFile('./test/option-compact/expected.txt', {
			encoding: 'utf8'
		})
	])

	t.deepEqual(actual, expected)
})

test(`it shows all stats in the table if the --no-compact option is passed`, async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['--no-compact'], {
			input: 'a{}'
		}),
		readFile('./test/no-options/expected.txt', {
			encoding: 'utf8'
		})
	])

	t.deepEqual(actual, expected)
})
