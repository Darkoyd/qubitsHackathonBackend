const debug = require('debug')('backend:routes:auth')
const express = require('express')

const router = express.Router()
// eslint-disable-next-line no-undef
const { User, UserAuthToken } = require(`${process.cwd()}/src/db`)
const wrapper = require('express-debug-async-wrap')(debug)

router.post('/signin', wrapper(async (req, res) => {
	const user = await findByEmail(req.body.email)
	const passwordMatch = user.authenticate(req.body.password)
	if (passwordMatch) {
		const token = await UserAuthToken.create({ UserId: user.id })
		return res.send({ token: token.token })
	}
	const err = new Error('Invalid credentials')
	err.status = 401
	throw err
}))

router.get('/signout', wrapper(async (req, res) => {
	const result = await UserAuthToken.destroy({ where: { token: req.get('X-Auth-Token') } })
	if (result === 0) {
		debug('Token didn\'t exist')
	}
	res.sendStatus(200)
}))

module.exports = router