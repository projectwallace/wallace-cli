const test = require('ava')
const execa = require('execa')

test(`it shows compact json output when the --format=json and --compact options are passed`, async t => {
	const {stdout} = await execa('./cli.js', ['--format=json', '--compact'], {
		input: 'a{}'
	})

	t.snapshot(stdout)
})

test(`it shows compact pretty output when the --format=pretty and --compact options are passed`, async t => {
	const {stdout} = await execa(
		'./cli.js',
		['--format', 'pretty', '--compact'],
		{
			input: 'a{}'
		}
	)

	t.snapshot(stdout)
})
