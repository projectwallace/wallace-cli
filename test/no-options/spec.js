const {promisify} = require('util')
const fs = require('fs')
const test = require('ava')
const execa = require('execa')

const readFile = promisify(fs.readFile)

test(`it shows a table with stats if no options are passed`, async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', {
			input: 'a{}'
		}),
		readFile('./test/no-options/expected.txt', {
			encoding: 'utf8'
		})
	])

	t.deepEqual(actual, expected)
})

// @TODO: make this test work
/* eslint-disable ava/no-skip-test */
test.skip('it shows a table of stats if a valid url is passed', async t => {
	// @TODO: it would be better if this test wouldn't make
	// an actual HTTP request
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['https://file-huqyrptkwt.now.sh']),
		readFile('./test/no-options/expected.txt')
	])

	t.deepEqual(actual, expected)
})
