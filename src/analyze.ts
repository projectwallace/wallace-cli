import { analyze } from '@projectwallace/css-analyzer'
import {
	atrules,
	box_shadows,
	colors,
	declarations,
	font_families,
	font_sizes,
	gradients,
	line_heights,
	properties,
	resets,
	rules,
	selectors,
	specificity,
	stylesheet,
	text_shadows,
	units,
	value_browserhacks,
	value_prefixes,
	z_indexes,
} from '@projectwallace/css-analyzer/collectors'
import { analyze_all } from '@projectwallace/css-analyzer/presets'

// Only the stats that are shown in the terminal output
export function analyze_css(css: string) {
	return analyze(css, {
		stylesheet: stylesheet(),
		atrules: atrules(),
		rules: rules(),
		selectors: selectors(),
		specificity: specificity(),
		declarations: declarations(),
		properties: properties(),
		colors: colors(),
		gradients: gradients(),
		font_sizes: font_sizes(),
		font_families: font_families(),
		line_heights: line_heights(),
		text_shadows: text_shadows(),
		box_shadows: box_shadows(),
		z_indexes: z_indexes(),
		value_prefixes: value_prefixes(),
		value_browserhacks: value_browserhacks(),
		units: units(),
		resets: resets(),
	})
}

export type CssAnalysis = ReturnType<typeof analyze_css>

// Everything the analyzer can collect, as JSON (Maps don't serialize by default)
export function analyze_css_json(css: string): string {
	return JSON.stringify(analyze_all(css), (_key, value) =>
		value instanceof Map ? Object.fromEntries(value) : value,
	)
}
