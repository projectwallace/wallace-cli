const test = require('ava')
const execa = require('execa')

test(`it shows a verbose table if the --verbose option is passed`, async t => {
	const {stdout} = await execa('./src/cli.js', ['--verbose'], {
		input: '.js-verbose{color:red}'
	})

	t.snapshot(stdout)
	t.true(stdout.includes('Complexity'))
	t.true(stdout.includes('Performance'))
	t.true(stdout.includes('Selectors'))
	t.true(stdout.includes('Branding'))
	t.true(stdout.includes('.js-verbose'))
	t.true(stdout.includes('1 x  ■  red️'))
})

test(`it shows a verbose table if the -v option is passed`, async t => {
	const {stdout} = await execa('./src/cli.js', ['-v'], {
		input: '.js-verbose{color:red}'
	})

	t.snapshot(stdout)
	t.true(stdout.includes('Complexity'))
	t.true(stdout.includes('Performance'))
	t.true(stdout.includes('Selectors'))
	t.true(stdout.includes('Branding'))
	t.true(stdout.includes('.js-verbose'))
	t.true(stdout.includes('1 x  ■  red️'))
})

test(`it shows the default stats if the --no-verbose option is passed`, async t => {
	const {stdout} = await execa('./src/cli.js', ['--no-verbose'], {
		input: 'a{}'
	})

	t.snapshot(stdout)
	t.true(stdout.includes('Complexity'))
	t.true(stdout.includes('Performance'))
	t.true(stdout.includes('Selectors'))
	t.true(stdout.includes('Branding'))
	t.true(
		stdout.includes('‣ Font-sizes                  0         0       0.0%')
	)
	t.false(stdout.includes('.js-verbose'))
	t.false(stdout.includes('1 x  ■  red️'))
})
