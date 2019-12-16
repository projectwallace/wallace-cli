const extractCss = require('extract-css-core')
const normalizeUrl = require('normalize-url')
const isUrl = require('./is-url')

module.exports = async input => {
	if (!isUrl(input)) {
		return input
	}

	const url = normalizeUrl(input, {
		stripWWW: false
	})

	return extractCss(url, {waitUntil: 'networkidle0'})
}
