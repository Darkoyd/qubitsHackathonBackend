const debug = require('debug')('backend:routes:authRoutes')
const express = require('express')
const {v4: uuidv4} = require('uuid')

const router = express.Router()
// eslint-disable-next-line no-undef
const { User, UserAuthToken } = require(`${process.cwd()}/src/db`)
const wrapper = require('express-debug-async-wrap')(debug)

router.get('/', wrapper(async(req, res) => {
	res.sendStatus(200)
}))

router.post('/signin', wrapper(async (req, res) => {
	const user = await findByEmail(req.body.email)
	const passwordMatch = user.authenticate(req.body.password)
	if (passwordMatch) {
		const token = await UserAuthToken.create({ UserId: user.id })

		return res.send({ user: user, token: token.token })
	}
	const err = new Error('Invalid credentials')
	err.status = 401
	throw err
}))

router.get('/signout', wrapper(async (req, res) => {
	const result = await UserAuthToken.destroy({ where: { token: req.get('autorization') } })
	if (result === 0) {
		debug('Token didn\'t exist')
	}
	res.sendStatus(200)
}))

router.post('/register', wrapper(async (req, res) => {
	let user
	req.body.id = uuidv4()
	try {
		user = await User.create(req.body)
	} catch (err) {
		console.log(err)
		throw new Error(err.message)
	}
	res.status(201).send(user)
}))

function findByEmail (email, noError = false) {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		const result = await User.findOne({ where: { email: email } })
		if (result === null && !noError) {
			const err = new Error('Invalid credentials')
			err.status = 401
			reject(err)
		}
		resolve(result)
	})
}

module.exports = router