const debug = require('debug')('backend:routes:user')
const express = require('express')

const router = express.Router()
// eslint-disable-next-line no-undef
const { User } = require(`${process.cwd()}/src/db`)
const wrapper = require('express-debug-async-wrap')(debug)


router.get('/:UserId', wrapper( async (req, res) =>{
	const user = await User.findOne({ where: { id: req.params.UserId } })
	if (user === 0) {
		res.sendStatus(204)
	}
	else{
		res.send(user)
	}
}))

module.exports = router