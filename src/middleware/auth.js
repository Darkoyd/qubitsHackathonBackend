const { UserAuthToken } = require(`${process.cwd()}/src/db`)

module.exports = async (req, res, next) => {
	if (req.path.indexOf('/auth') === 0) return next()
	const token = await UserAuthToken.findOne({ where: { token: req.get('X-Auth-Token') } })
	if (token === null) return res.sendStatus(401)
	next()
}