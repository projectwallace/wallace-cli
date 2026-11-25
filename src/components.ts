import { to_filesize, to_number, to_percentage, pad_end, pad_start } from './formatters.ts'
import { summarize, summarize_numbers } from '@projectwallace/css-analyzer'
import { summarize_specificity } from '@projectwallace/css-analyzer/collectors'
import type { CountResult } from '@projectwallace/css-analyzer'
import type { CssAnalysis } from './analyze.ts'
import type { Colors } from './types.ts'

const columns = [19, 12, 12, 12]
const width = columns.reduce((total, num) => (total += num), 0) + columns.length

function Row(...tds: unknown[]): string {
	return tds
		.map((td, index) => {
			if (index === 0) {
				return pad_end(String(td), columns[index])
			}
			return pad_start(String(td), columns[index])
		})
		.join(' ')
}

function Hr(style: Colors): string {
	return style.dim(''.padEnd(width, '─'))
}

function Summary(stats: CssAnalysis, style: Colors): string {
	const columns = [
		['Lines of Code', String(to_number(stats.stylesheet.source_lines_of_code))],
		['Filesize', to_filesize(stats.stylesheet.size)],
		['Rules', String(to_number(stats.rules.total))],
		['Selectors', String(to_number(stats.selectors.total))],
		['Declarations', String(to_number(stats.declarations.total))],
	]
	const widths = columns.map(([header, value]) => Math.max(header.length, value.length))
	const last = columns.length - 1
	function cell(text: string, index: number): string {
		return index === last ? text : text.padEnd(widths[index])
	}

	return [
		Hr(style),
		columns.map(([header], i) => cell(header, i)).join(style.dim(' │ ')),
		columns.map(([, value], i) => style.bold(cell(value, i))).join(style.dim(' │ ')),
		Hr(style),
	].join('\n')
}

// Total, unique and unique % of a collected stat
function CountRow(title: string, counts: CountResult): string {
	return Row(
		title,
		to_number(counts.total),
		to_number(counts.total_unique),
		to_percentage(summarize(counts).uniqueness_ratio),
	)
}

// Most common, average and maximum of a collected numeric stat
function SummaryRow(title: string, counts: CountResult<number>): string {
	const { mode, mean, max } = summarize_numbers(counts)
	return Row(title, to_number(mode), to_number(mean), to_number(max))
}

function Stylesheet(stylesheet: CssAnalysis['stylesheet'], style: Colors): string {
	return [
		Row(
			'Comments',
			to_filesize(stylesheet.comments.size),
			style.dim(`(${stylesheet.comments.total} items)`),
		),
		Row(
			'Embedded Content',
			to_filesize(stylesheet.embedded.size),
			style.dim(`(${stylesheet.embedded.total} items)`),
		),
	].join('\n')
}

function Rules(rules: CssAnalysis['rules'], style: Colors): string {
	const empty_count = to_number(rules.empty)
	return [
		Row(
			style.underline('Rulesets'),
			style.dim('Most common'),
			style.dim('Average'),
			style.dim('Maximum'),
		),
		SummaryRow('Selectors / rule', rules.selectors),
		SummaryRow('Declarations / rule', rules.declarations),
		Row(`Empty rules`, '', '', rules.empty > 0 ? style.red(String(empty_count)) : empty_count),
	].join('\n')
}

function Selectors(
	selectors: CssAnalysis['selectors'],
	specificity: CssAnalysis['specificity'],
	style: Colors,
): string {
	const { mode, mean, max } = summarize_specificity(specificity)
	return [
		Row(
			style.underline('Selectors'),
			style.dim('Most common'),
			style.dim('Average'),
			style.dim('Maximum'),
		),
		SummaryRow('Complexity', selectors.complexity),
		Row(
			'Specificity',
			mode.join(style.dim('/')),
			mean.map((n) => to_number(n, { decimals: 1 })).join(style.dim('/')),
			max.join(style.dim('/')),
		),
		Row(),
		Row('', style.dim('Total'), style.dim('Unique'), style.dim('Ratio')),
		CountRow('All Selectors', selectors),
		CountRow('ID Selectors', selectors.ids),
		CountRow('Accessibility', selectors.accessibility),
		CountRow('Vendor prefixed', selectors.prefixed),
	].join('\n')
}

function AtRules(atrules: CssAnalysis['atrules'], style: Colors): string {
	const { media, supports, font_faces, imports, keyframes, containers, properties } = atrules

	return [
		Row(style.underline('AtRules'), style.dim('Total'), style.dim('Unique'), style.dim('Unique %')),
		CountRow('@media', media),
		CountRow('@supports', supports),
		Row('@font-face', to_number(font_faces.total)),
		CountRow('@import', imports),
		CountRow('@keyframes', keyframes),
		CountRow('@container', containers),
		CountRow('@property', properties),
	].join('\n')
}

function Declarations(declarations: CssAnalysis['declarations'], style: Colors): string {
	return [
		Row(
			style.underline('Declarations'),
			style.dim('Total'),
			style.dim('Unique'),
			style.dim('Unique %'),
		),
		CountRow('All Declarations', declarations),
		Row('!important', to_number(declarations.importants.total)),
	].join('\n')
}

function Properties(properties: CssAnalysis['properties'], style: Colors): string {
	return [
		Row(
			style.underline('Properties'),
			style.dim('Total'),
			style.dim('Unique'),
			style.dim('Unique %'),
		),
		CountRow('All Properties', properties),
		CountRow('Custom Properties', properties.custom),
		CountRow('Vendor Prefixed', properties.prefixed),
		CountRow('Browserhacks', properties.browserhacks),
	].join('\n')
}

function Values(stats: CssAnalysis, style: Colors): string {
	return [
		Row(style.underline('Values'), style.dim('Total'), style.dim('Unique'), style.dim('Unique %')),
		CountRow('Colors', stats.colors),
		CountRow('Gradients', stats.gradients),
		CountRow('Font-sizes', stats.font_sizes),
		CountRow('Font-families', stats.font_families),
		CountRow('Line-heights', stats.line_heights),
		CountRow('Text-shadows', stats.text_shadows),
		CountRow('Box-shadows', stats.box_shadows),
		CountRow('Z-indexes', stats.z_indexes),

		CountRow('Vendor Prefixed', stats.value_prefixes),
		CountRow('Browserhacks', stats.value_browserhacks),
		CountRow('Units', stats.units),
		CountRow('Resets', stats.resets),
	].join('\n')
}

export function Analytics(stats: CssAnalysis, style: Colors): string {
	return [
		Summary(stats, style),
		Row(),
		Stylesheet(stats.stylesheet, style),
		Row(),
		Rules(stats.rules, style),
		Row(),
		Selectors(stats.selectors, stats.specificity, style),
		Row(),
		AtRules(stats.atrules, style),
		Row(),
		Declarations(stats.declarations, style),
		Row(),
		Properties(stats.properties, style),
		Row(),
		Values(stats, style),
	].join('\n')
}
