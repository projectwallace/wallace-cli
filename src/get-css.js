const extractCss = require('extract-css-core')
const isUrl = require('./is-url')

module.exports = async input => {
	if (!isUrl(input)) {
		return input
	}

	return extractCss(input)
}
