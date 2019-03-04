const test = require('ava')
const execa = require('execa')

test(`it shows json output when the --format=json option is passed`, async t => {
	const {stdout} = await execa('./cli.js', ['--format', 'json'], {
		input: 'a{}'
	})

	t.snapshot(stdout)
})

test(`it shows json output when the -f=json option is passed`, async t => {
	const {stdout} = await execa('./cli.js', ['-f', 'json'], {
		input: 'a{}'
	})
	t.snapshot(stdout)
})

test(`it shows json output when an uppercase json format option is passed`, async t => {
	const {stdout} = await execa('./cli.js', ['--format', 'JSON'], {
		input: 'a{}'
	})
	t.snapshot(stdout)
})

test(`it shows pretty output when --format=pretty is passed`, async t => {
	const {stdout} = await execa('./cli.js', ['--format', 'pretty'], {
		input: 'a{}'
	})

	t.snapshot(stdout)
})
