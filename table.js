const Table = require('cli-table3')
const chalk = require('chalk')
const cliTruncate = require('cli-truncate')
const tinycolor = require('tinycolor2')
const leftPad = require('left-pad')
const prettyBytes = require('pretty-bytes')
const sortColors = require('color-sorter')
const termSize = require('term-size')

// The minimum amount of characters needed to properly render the table
const MIN_WIDTH = 36
// The width of the CLI window
const {columns: WINDOW_WIDTH} = termSize()
// The max-width that a value on the outer right side can have
const MAX_VALUE_WIDTH = WINDOW_WIDTH - MIN_WIDTH

const roundFraction = fraction => {
	return fraction.toFixed(3)
}

const fractionToPercentage = fraction => {
	if (fraction === 0) {
		return '0%'
	}
	if (fraction === 1) {
		return '100%'
	}
	return `${roundFraction(fraction * 100)}%`
}

const fractionOfTotal = (part, total) => {
	if (total === 0 || part === 0) {
		return fractionToPercentage(0)
	}
	return fractionToPercentage(part / total)
}

const listWithCount = list => {
	if (list.length === 0) {
		return chalk.dim('N\\A')
	}

	const padWidth = Math.max(...list.map(i => i.count)).toString().length

	return list.map(item => {
		return chalk`{dim ${leftPad(item.count, padWidth)} ×} ${cliTruncate(item.value, MAX_VALUE_WIDTH)}`
	}).join('\n')
}

const listSelectors = list => {
	return list.map((selector, i) => {
		return chalk`{dim ${(i + 1)}.} ${cliTruncate(selector.selector, MAX_VALUE_WIDTH)}`
	}).join('\n')
}

module.exports = stats => {
	const table = new Table()
	const heading = chalk.hex('#29c87d').bold
	const th = title => ({hAlign: 'right', content: chalk.dim(title)})
	const numericCell = value => ({hAlign: 'right', content: value})
	const numericRow = (title, stat) => {
		return [
			title,
			numericCell(stats[`${stat}.total`]),
			numericCell(stats[`${stat}.totalUnique`]),
			numericCell(fractionOfTotal(stats[`${stat}.totalUnique`], stats[`${stat}.total`]))
		]
	}
	const listRow = (title, list) => ([title, {colSpan: 3, content: list}])

	table.push(
		[{colSpan: 4, content: heading('Stylesheet')}],
		['Stylesheet size', prettyBytes(stats['stylesheets.size'])],
		['Simplicity', roundFraction(stats['stylesheets.simplicity'])],
		['Cohesion', roundFraction(stats['stylesheets.cohesion.average'])],
		['Rules', stats['rules.total']]
	)

	table.push(
		[
			heading('At-Rules'),
			th('Total'),
			th('Unique'),
			th('Unique (%)')
		],
		numericRow('@media queries', 'atrules.mediaqueries'),
		numericRow('@font-faces', 'atrules.fontfaces'),
		numericRow('@keyframes', 'atrules.keyframes')
	)

	if (stats['atrules.mediaqueries.unique']) {
		table.push(listRow(
			'@media queries',
			listWithCount(stats['atrules.mediaqueries.unique'])
		))
	}

	table.push(
		[
			heading('Selectors'),
			th('Total'),
			th('Unique'),
			th('Unique (%)')
		],
		numericRow('All', 'selectors'),
		numericRow('ID', 'selectors.id'),
		numericRow('JS', 'selectors.js'),
		numericRow('Universal', 'selectors.universal'),
		numericRow('Accessibility', 'selectors.accessibility'),
		[
			'Average identifiers',
			numericCell(roundFraction(stats['selectors.identifiers.average']))
		]
	)

	if (stats['selectors.identifiers.top']) {
		table.push(listRow(
			'Max. identifiers',
			listSelectors(stats['selectors.identifiers.top']))
		)
	}

	if (stats['selectors.specificity.top']) {
		table.push(listRow(
			'Top specificity',
			listSelectors(stats['selectors.specificity.top']))
		)
	}

	if (stats['selectors.id.unique']) {
		table.push(listRow(
			'ID Selectors',
			listWithCount(stats['selectors.id.unique']))
		)
	}

	if (stats['selectors.js.unique']) {
		table.push(listRow(
			'JS Selectors',
			listWithCount(stats['selectors.js.unique']))
		)
	}

	if (stats['selectors.universal.unique']) {
		table.push(listRow(
			'Universal Selectors',
			listWithCount(stats['selectors.universal.unique']))
		)
	}

	if (stats['selectors.accessibility.unique']) {
		table.push(listRow(
			'Accessibility Selectors',
			listWithCount(stats['selectors.accessibility.unique']))
		)
	}

	table.push(
		[
			heading('Declarations'),
			th('Total'),
			th('Unique'),
			th('Share (%)')
		],
		numericRow('All', 'declarations'),
		[
			'!importants',
			numericCell(stats['declarations.importants.total']),
			'',
			numericCell(fractionToPercentage(stats['declarations.importants.share']))
		],
	)

	table.push(
		[
			heading('Properties'),
			th('Total'),
			th('Unique'),
			th('Unique (%)')
		],
		numericRow('All', 'properties'),
		numericRow('Prefixed', 'properties.prefixed')
	)

	if (stats['properties.prefixed.unique']) {
		table.push(listRow(
			'Prefixed',
			listWithCount(stats['properties.prefixed.unique']))
		)
	}

	table.push(
		[
			heading('Values'),
			th('Total'),
			th('Unique'),
			th('Unique (%)')
		],
		numericRow('Prefixed', 'values.prefixed'),
		numericRow('Colors', 'values.colors'),
		numericRow('Font-families', 'values.fontfamilies'),
		numericRow('Font-sizes', 'values.fontsizes')
	)

	if (stats['values.colors.unique']) {
		const padSize = Math.max(...stats['values.colors.unique'].map(c => c.count)).toString().length
		const content = sortColors(stats['values.colors.unique'].map(c => c.value)).map(color => {
			const {count} = stats['values.colors.unique'].find(c => c.value === color)
			const hex = tinycolor(color).toHex()
			return chalk`{dim ${leftPad(count, padSize) + ' ×'}} ${chalk.hex(hex)(color)}`
		}).join('\n')
		table.push(listRow('Unique Colors', content))
	}

	if (stats['values.fontsizes.unique']) {
		table.push(listRow(
			'Unique font-sizes',
			listWithCount(stats['values.fontsizes.unique']))
		)
	}

	if (stats['values.fontfamilies.unique']) {
		table.push(listRow(
			'Unique font-families',
			listWithCount(stats['values.fontfamilies.unique']))
		)
	}

	if (stats['values.prefixed.unique']) {
		table.push(listRow(
			'Prefixed',
			listWithCount(stats['values.prefixed.unique']))
		)
	}

	return table.toString()
}
