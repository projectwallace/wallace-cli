const test = require('ava')
const execa = require('execa')

test(`it shows json output when the --format=json option is passed`, async t => {
	const {stdout} = await execa('./src/cli.js', ['--format', 'json'], {
		input: 'a{}'
	})

	t.snapshot(stdout)
	t.true(stdout.includes('"stylesheets.size":3'))
})

test(`it shows json output when the -f=json option is passed`, async t => {
	const {stdout} = await execa('./src/cli.js', ['-f', 'json'], {
		input: 'a{}'
	})
	t.snapshot(stdout)
	t.true(stdout.includes('"stylesheets.size":3'))
})

test(`it shows json output when an uppercase json format option is passed`, async t => {
	const {stdout} = await execa('./src/cli.js', ['--format', 'JSON'], {
		input: 'a{}'
	})
	t.snapshot(stdout)
	t.true(stdout.includes('"stylesheets.size":3'))
})

test(`it shows pretty output when --format=pretty is passed`, async t => {
	const {stdout} = await execa('./src/cli.js', ['--format', 'pretty'], {
		input: 'a{}'
	})

	t.snapshot(stdout)
	t.false(stdout.includes('"stylesheets.size":3'))
})
