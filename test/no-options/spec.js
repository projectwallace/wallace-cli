const test = require('ava')
const execa = require('execa')

test(`it shows a table with stats if no options are passed and CSS is passed via STDIN`, async t => {
	const {stdout} = await execa('./cli.js', {
		input: 'a{}'
	})
	t.snapshot(stdout)
})

test(`it shows a table with stats if no options are passed and CSS is passed as argument`, async t => {
	const {stdout} = await execa('./cli.js', ['a{}'])
	t.snapshot(stdout)
})

// @TODO: make this test work
/* eslint-disable ava/no-skip-test */
test.skip('it shows a table of stats if a valid url is passed', async t => {
	// @TODO: it would be better if this test wouldn't make
	// an actual HTTP request
	const {stdout} = await execa('./cli.js', ['https://file-huqyrptkwt.now.sh'])
	t.snapshot(stdout)
})
/* eslint-enable ava/no-skip-test */

test('it exits with a non-zero exit code on invalid CSS', async t => {
	const {code, stdout} = await t.throwsAsync(
		// Intentional CSS Syntax Error
		execa('./cli.js', ['a{color    red}'])
	)

	t.is(code, 1)
	t.snapshot(stdout)
})
