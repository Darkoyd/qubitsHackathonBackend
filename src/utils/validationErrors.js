module.exports = {
	len: (field, min, max) => `${field} must be between ${min} and ${max} characters long`,
	empty: field => `${field} cannot be empty`,
	url: field => `${field} must be a valid URL`
}