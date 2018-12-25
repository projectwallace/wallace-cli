const {promisify} = require('util')
const fs = require('fs')
const test = require('ava')
const execa = require('execa')

const readFile = promisify(fs.readFile)

test(`it shows json output when the --format=json option is passed`, async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['--format', 'json'], {
			input: 'a{}'
		}),
		readFile('./test/option-format/expected.json', {
			encoding: 'utf8'
		})
	])

	// Expected needs to trimmed because editors keep adding a
	// newline to the end of the file :|
	t.deepEqual(actual, expected.trim())
})

test(`it shows json output when the -f=json option is passed`, async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['-f', 'json'], {
			input: 'a{}'
		}),
		readFile('./test/option-format/expected.json', {
			encoding: 'utf8'
		})
	])

	// Expected needs to trimmed because editors keep adding a
	// newline to the end of the file :|
	t.deepEqual(actual, expected.trim())
})

test(`it shows json output when an uppercase json format option is passed`, async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['--format', 'JSON'], {
			input: 'a{}'
		}),
		readFile('./test/option-format/expected.json', {
			encoding: 'utf8'
		})
	])

	// Expected needs to trimmed because editors keep adding a
	// newline to the end of the file :|
	t.deepEqual(actual, expected.trim())
})

test(`it shows pretty output when --format=pretty is passed`, async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['--format', 'pretty'], {
			input: 'a{}'
		}),
		readFile('./test/no-options/expected.txt', {
			encoding: 'utf8'
		})
	])

	t.deepEqual(actual, expected)
})
