const got = require('got')
const isUrl = require('is-url-superb')
const normalizeUrl = require('normalize-url')

module.exports = async (input, options = {}) => {
	if (!isUrl(input)) {
		return input
	}

	const url = normalizeUrl(input, {stripWWW: false})

	const {body} = await got(`https://extract-css.now.sh/${url}`, {
		responseType: 'text',
		resolveBodyOnly: true,
		headers: {
			'User-Agent': options.userAgent
		}
	})

	return body
}
