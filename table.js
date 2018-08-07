const Table = require('cli-table3')
const chalk = require('chalk')
const cliTruncate = require('cli-truncate')
const tinycolor = require('tinycolor2')
const leftPad = require('left-pad')
const prettyBytes = require('pretty-bytes')
const sortColors = require('color-sorter')

const roundFraction = fraction => {
	return fraction.toFixed(3)
}

const fractionToPercentage = fraction => {
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

	return list.map(item => {
		return chalk`{dim ${leftPad(item.count, 2)} ×} ${cliTruncate(item.value, 34)}`
	}).join('\n')
}

const listSelectors = list => {
	return list.map((selector, i) => {
		return chalk`{dim ${(i + 1)}.} ${cliTruncate(selector.selector, 36)}`
	}).join('\n')
}

module.exports = stats => {
	const table = new Table()
	const heading = chalk.hex('#29c87d').bold

	table.push(
		[{colSpan: 3, content: heading('Global')}],
		['Stylesheet size', prettyBytes(stats['stylesheets.size'])],
		['Simplicity', roundFraction(stats['stylesheets.simplicity'])],
		['Cohesion', roundFraction(stats['stylesheets.cohesion.average'])],
		['Rules', stats['rules.total']]
	)

	table.push(
		[heading('At-Rules'), chalk.dim('Total'), chalk.dim('Unique')],
		['@media queries', stats['atrules.mediaqueries.total'], stats['atrules.mediaqueries.totalUnique']],
		['@font-faces', stats['atrules.fontfaces.total'], stats['atrules.fontfaces.totalUnique']],
		['@keyframes', stats['atrules.keyframes.total'], stats['atrules.keyframes.totalUnique']]
	)

	table.push(
		[heading('Selectors'), chalk.dim('Total'), chalk.dim('Unique')],
		['All', stats['selectors.total'], stats['selectors.totalUnique']],
		['ID', stats['selectors.id.total'], stats['selectors.id.totalUnique']],
		['JS', stats['selectors.js.total'], stats['selectors.js.totalUnique']],
		['Universal', stats['selectors.universal.total'], stats['selectors.universal.totalUnique']],
		['Accessibility', stats['selectors.accessibility.total'], stats['selectors.accessibility.totalUnique']],
		['Average identifiers', roundFraction(stats['selectors.identifiers.average'])],
	)

	if (stats['selectors.identifiers.top']) {
		table.push([
			'Max. identifiers',
			{colSpan: 2, content: listSelectors(stats['selectors.identifiers.top'])}
		])
	}

	if (stats['selectors.specificity.top']) {
		table.push([
			'Top specificity',
			{colSpan: 2, content: listSelectors(stats['selectors.specificity.top'])}
		])
	}

	if (stats['selectors.id.unique']) {
		table.push([
			'ID Selectors',
			{colSpan: 2, content: listWithCount(stats['selectors.id.unique'])}
		])
	}

	if (stats['selectors.js.unique']) {
		table.push([
			'JS Selectors',
			{colSpan: 2, content: listWithCount(stats['selectors.js.unique'])}
		])
	}

	if (stats['selectors.universal.unique']) {
		table.push([
			'Universal Selectors',
			{colSpan: 2, content: listWithCount(stats['selectors.universal.unique'])}
		])
	}

	if (stats['selectors.accessibility.unique']) {
		table.push([
			'Accessibility Selectors',
			{colSpan: 2, content: listWithCount(stats['selectors.accessibility.unique'])}
		])
	}

	table.push(
		[heading('Declarations'), chalk.dim('Total'), chalk.dim('Share')],
		['Total', stats['declarations.total']],
		['Unique', stats['declarations.totalUnique'], fractionOfTotal(stats['declarations.totalUnique'], stats['declarations.total'])],
		['!importants', stats['declarations.importants.total'], fractionToPercentage(stats['declarations.importants.share'])],
	)

	table.push(
		[heading('Properties'), chalk.dim('Total'), chalk.dim('Share')],
		['All', stats['properties.total']],
		['Unique', stats['properties.totalUnique'], fractionOfTotal(stats['properties.totalUnique'], stats['properties.total'])],
		['Prefixed', stats['properties.prefixed.total'], fractionToPercentage(stats['properties.prefixed.share'])]
	)

	if (stats['properties.prefixed.unique']) {
		table.push([
			'Prefixed',
			{
				colSpan: 2,
				content: listWithCount(stats['properties.prefixed.unique'])
			}
		])
	}

	table.push(
		[heading('Values'), chalk.dim('Total'), chalk.dim('Unique')],
		['Prefixed', stats['values.prefixed.total'], stats['values.prefixed.totalUnique']],
		['Colors', stats['values.colors.total'], stats['values.colors.totalUnique']],
		['Font-sizes', stats['values.fontsizes.total'], stats['values.fontsizes.totalUnique']],
		['Font-families', stats['values.fontfamilies.total'], stats['values.fontfamilies.totalUnique']]
	)

	if (stats['values.colors.unique']) {
		table.push([
			'Unique Colors',
			{
				colSpan: 2,
				content: sortColors(stats['values.colors.unique'].map(c => c.value)).map(color => {
					const {count} = stats['values.colors.unique'].find(c => c.value === color)
					const hex = tinycolor(color).toHex()
					return chalk`{dim ${leftPad(count, 3) + ' ×'}} ${chalk.hex(hex)(color)}`
				}).join('\n')
			}
		])
	}

	if (stats['values.fontsizes.unique']) {
		table.push([
			'Unique font-sizes',
			{
				colSpan: 2,
				content: listWithCount(stats['values.fontsizes.unique'])
			}
		])
	}

	if (stats['values.fontfamilies.unique']) {
		table.push([
			'Unique font-families',
			{
				colSpan: 2,
				content: listWithCount(stats['values.fontfamilies.unique'])
			}
		])
	}

	if (stats['values.prefixed.unique']) {
		table.push([
			'Prefixed',
			{
				colSpan: 2,
				content: listWithCount(stats['values.prefixed.unique'])
			}
		])
	}

	return table.toString()
}
