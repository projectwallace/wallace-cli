/*
 * Test whether a string is an url
 * @example https://regex101.com/r/F0tEKd/3/tests
 */
module.exports = string => {
	if (typeof string !== 'string') {
		return false
	}

	return string.match(
		/^(?:https:\/\/|http:\/\/|\/\/)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
	)
}
