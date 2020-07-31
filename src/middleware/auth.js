// eslint-disable-next-line no-undef
const { UserAuthToken } = require(`${process.cwd()}/src/db`)
const debug = require('debug')('backend:authMiddleware')

module.exports = async (req, res, next) => {
	const route =  req.path.split('/')[1]
	debug(route)
	if (route === 'auth' || route === 'health' || route === 'webhook') return next()
	if (!req.get('x-auth-token')) return res.status(400).send('There is no auth token')
	const token = await UserAuthToken.findOne({ where: { token: req.get('x-auth-token') } })
	if (token === null) {
		debug('Unauthorized request')
		return res.status(401).send('Unauthorized')
	}
	next()
}