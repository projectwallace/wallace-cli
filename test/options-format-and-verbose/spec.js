const test = require('ava')
const execa = require('execa')

test(`it shows compact json output when the --format=json and --verbose options are passed`, async t => {
	const {stdout} = await execa('./src/cli.js', ['--format=json', '--verbose'], {
		input: 'a{}'
	})

	t.snapshot(stdout)
	t.true(stdout.includes('"stylesheets.size":3'))
})

test(`it shows verbose pretty output when the --format=pretty and --verbose options are passed`, async t => {
	const {stdout} = await execa(
		'./src/cli.js',
		['--format', 'pretty', '--verbose'],
		{
			input: '.js-verbose{color:red}'
		}
	)

	t.snapshot(stdout)
	t.true(stdout.includes('Complexity'))
	t.true(stdout.includes('Performance'))
	t.true(stdout.includes('Selectors'))
	t.true(stdout.includes('Branding'))
	t.true(stdout.includes('.js-verbose'))
	t.true(stdout.includes('1 x  ■  red️'))
})
