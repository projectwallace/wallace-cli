const test = require('ava')
const execa = require('execa')

test(`it shows a compact table if the --compact option is passed`, async t => {
	const {stdout} = await execa('./cli.js', ['--compact'], {
		input: 'a{}'
	})

	t.snapshot(stdout)
})

test(`it shows a compact table if the -c option is passed`, async t => {
	const {stdout} = await execa('./cli.js', ['-c'], {
		input: 'a{}'
	})

	t.snapshot(stdout)
})

test(`it shows all stats in the table if the --no-compact option is passed`, async t => {
	const {stdout} = await execa('./cli.js', ['--no-compact'], {
		input: 'a{}'
	})

	t.snapshot(stdout)
})
