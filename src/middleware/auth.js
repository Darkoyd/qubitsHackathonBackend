// eslint-disable-next-line no-undef
const { UserAuthToken } = require(`${process.cwd()}/src/db`)
const debug = require('debug')('backend:authMiddleware')

module.exports = async (req, res, next) => {
	if (req.path.indexOf('/auth') === 0) return next()
	try {
		const token = await UserAuthToken.findOne({ where: { token: req.get('X-Auth-Token') } })
		if (token === null) return res.sendStatus(401)
	} catch (err) {
		debug(err)
	}
	next()
}