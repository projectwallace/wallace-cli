const test = require('ava')
const execa = require('execa')
const semver = require('semver')

test('it shows a valid version when passing -v', async t => {
	const {stdout} = await execa('./cli.js', ['-v'])
	t.is(stdout, semver.valid(stdout))
})

test('it shows a valid version when passing --version', async t => {
	const {stdout} = await execa('./cli.js', ['--version'])
	t.is(stdout, semver.valid(stdout))
})

test(`it shows lots of details when no options are passed`, async t => {
	const {stdout} = await execa('./cli.js', {
		input: 'a{}'
	})
	t.true(stdout.includes('Stylesheet'))
	t.true(stdout.includes('At-Rules'))
	t.true(stdout.includes('Selectors'))
	t.true(stdout.includes('Declarations'))
	t.true(stdout.includes('Properties'))
	t.true(stdout.includes('Values'))
	t.true(stdout.includes('Unique Colors'))
	t.true(stdout.includes('Unique font-sizes'))
	t.true(stdout.includes('Unique font-families'))
})

test(`it doesn't show details when --compact is used`, async t => {
	const {stdout} = await execa('./cli.js', ['--compact'], {
		input: 'a{}'
	})
	t.true(stdout.includes('Stylesheet'))
	t.true(stdout.includes('At-Rules'))
	t.true(stdout.includes('Selectors'))
	t.true(stdout.includes('Declarations'))
	t.true(stdout.includes('Properties'))
	t.true(stdout.includes('Values'))
	t.false(stdout.includes('Unique Colors'))
	t.false(stdout.includes('Unique font-sizes'))
	t.false(stdout.includes('Unique font-families'))
})

test(`the -c shorthand shows the same as the --compact default notation`, async t => {
	const input = 'a{}'
	const [longhand, shorthand] = await Promise.all([
		execa('./cli.js', ['--compact'], {
			input
		}),
		execa('./cli.js', ['-c'], {
			input
		})
	])

	t.is(longhand.stdout, shorthand.stdout)
})

test(`it shows json when the --format=json option is used`, async t => {
	const {stdout} = await execa('./cli.js', ['--format', 'json'], {
		input: 'a{}'
	})

	// this test assumes that the output is valid JSON if parsing it
	// doesn't throw errors (parsing invalid JSON throws an error)
	t.notThrows(() => JSON.parse(stdout))
	t.true(stdout.includes('"stylesheets.size": 3'))
	t.true(stdout.includes('"selectors.identifiers.max.value": "a"'))
})

test(`the -f shorthand shows the same as the --format default notation`, async t => {
	const input = 'a{}'
	const [longhand, shorthand] = await Promise.all([
		execa('./cli.js', ['--format', 'json'], {
			input
		}),
		execa('./cli.js', ['-f', 'json'], {
			input
		})
	])

	t.is(longhand.stdout, shorthand.stdout)
})

test('json format and compact mode can be combined', async t => {
	const {stdout} = await execa('./cli.js', ['--format', 'json', '--compact'], {
		input: 'a{}'
	})
	t.true(stdout.includes('"stylesheets.size": 3'))
	t.true(stdout.includes('"selectors.identifiers.max.value": "a"'))
	t.false(stdout.includes('"selectors.id.unique"'))
	t.false(stdout.includes('"values.colors.unique"'))
})
