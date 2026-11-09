import { analyze } from '@projectwallace/css-analyzer'

export function analyze_css(css: string) {
	// `__meta__` only holds timings, which would make the output non-deterministic
	const { __meta__, ...stats } = analyze(css, { useLocations: false })
	return stats
}

export type CssAnalysis = ReturnType<typeof analyze_css>
