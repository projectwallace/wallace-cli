const test = require('ava')
const execa = require('execa')
const fs = require('fs')
const {promisify} = require('util')
const readFile = promisify(fs.readFile)

test(`it shows compact json output when the --format=json and --compact options are passed`, async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['--format=json', '--compact'], {
			input: 'a{}'
		}),
		readFile('./test/options-format-and-compact/expected.json', {
			encoding: 'utf8'
		})
	])

	// Expected needs to trimmed because editors keep adding a
	// newline to the end of the file :|
	t.deepEqual(actual, expected.trim())
})

test(`it shows compact pretty output when the --format=pretty and --compact options are passed`, async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['--format', 'pretty', '--compact'], {
			input: 'a{}'
		}),
		readFile('./test/option-compact/expected.txt', {
			encoding: 'utf8'
		})
	])

	t.deepEqual(actual, expected)
})
