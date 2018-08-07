
const Table = require('cli-table3')
const chalk = require('chalk')
const cliTruncate = require('cli-truncate')
const tinycolor = require('tinycolor2')
const leftPad = require('left-pad')
const prettyBytes = require('pretty-bytes')
const sortColors = require('color-sorter')

module.exports = stats => {
	const table = new Table()
	const heading = chalk.hex('#29c87d').bold

	table.push(
		[{colSpan: 3, content: heading('Global')}],
		['Stylesheet size', prettyBytes(stats.stylesheets.size)],
		['Simplicity', stats.stylesheets.simplicity.toFixed(3)],
		['Cohesion', stats.stylesheets.cohesion.average.toFixed(3)],
		['Rules', stats.rules.total]
	)
	table.push(
		[heading('@-Rules'), chalk.dim('Total'), chalk.dim('Unique')],
		['@media queries', stats.atrules.mediaqueries.total, stats.atrules.mediaqueries.totalUnique],
		['@font-faces', stats.atrules.fontfaces.total, stats.atrules.fontfaces.totalUnique]
	)
	table.push(
		[heading('Selectors'), chalk.dim('Total'), chalk.dim('Unique')],
		['All', stats.selectors.total, stats.selectors.totalUnique],
		['ID', stats.selectors.id.total, stats.selectors.id.totalUnique],
		['JS', stats.selectors.js.total, stats.selectors.js.totalUnique],
		['Universal', stats.selectors.universal.total, stats.selectors.universal.totalUnique],
		['Accessibility', stats.selectors.accessibility.total, stats.selectors.accessibility.totalUnique],
		['Top specificity', {colSpan: 2, content: stats.selectors.specificity.top.map((specificity, i) => `${chalk.dim(i + 1 + '.')} ${cliTruncate(specificity.selector, 36)}`).join('\n')}],
		['Average identifiers', stats.selectors.identifiers.average.toFixed(3)],
		['Max. identifiers', {colSpan: 2, content: stats.selectors.identifiers.top.map((selector, i) => `${chalk.dim(i + 1 + '.')} ${cliTruncate(selector.selector, 36)}`).join('\n')}],
	)
	table.push(
		[heading('Declarations'), chalk.dim('Total'), chalk.dim('Share')],
		['Total', stats.declarations.total],
		['Unique', stats.declarations.totalUnique, `${(stats.declarations.totalUnique / stats.declarations.total * 100).toFixed(3)}%`],
		['!importants', stats.declarations.importants.total, `${(stats.declarations.importants.share * 100).toFixed(3)}%`],
	)
	table.push(
		[heading('Properties'), chalk.dim('Total'), chalk.dim('Share')],
		['All', stats.properties.total],
		['Unique', stats.properties.totalUnique, `${(stats.properties.totalUnique / stats.properties.total * 100).toFixed(3)}%`],
		['Prefixed', stats.properties.prefixed.total, `${(stats.properties.prefixed.share * 100).toFixed(3)}%`]
	)
	table.push(
		[heading('Values'), chalk.dim('Total'), chalk.dim('Unique')],
		['Prefixed', stats.values.prefixed.total, stats.values.prefixed.totalUnique],
		['Colors', stats.values.colors.total, stats.values.colors.totalUnique],
		['Font-sizes', stats.values.fontsizes.total, stats.values.fontsizes.totalUnique],
		['Font-families', stats.values.fontfamilies.total, stats.values.fontfamilies.totalUnique],
		['Unique Colors', {colSpan: 2, content: sortColors(stats.values.colors.unique.map(c => c.value)).map((color, i) => {
			return `${chalk.dim((leftPad(stats.values.colors.unique.find(c => c.value === color).count, 3) + ' ×'))} ${chalk.hex(tinycolor(color).toHex())(color)}`
		}).join('\n')}],
		['Unique font-sizes', {colSpan: 2, content: stats.values.fontsizes.unique.map((fontsize, i) => {
			return chalk`{dim ${leftPad(fontsize.count, 2)} ×} ${fontsize.value}`
		}).join('\n')}],
		['Unique font-families', {colSpan: 2, content: stats.values.fontfamilies.unique.map((fontsize, i) => {
			return chalk`{dim ${leftPad(fontsize.count, 2)} ×} ${cliTruncate(fontsize.value, 34)}`
		}).join('\n')}],
	)

	return table.toString()
}