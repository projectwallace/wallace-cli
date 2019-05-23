const isAbsoluteUrl = require('is-absolute-url')
const got = require('got')

module.exports = async (input, options = {}) => {
	if (!isAbsoluteUrl(input)) {
		return input
	}

	const {body} = await got(`https://extract-css.now.sh/${input}`, {
		responseType: 'text',
		resolveBodyOnly: true,
		headers: {
			'User-Agent': options.userAgent
		}
	})

	return body
}