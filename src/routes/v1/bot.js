const debug = require('debug')('backend:routes:bot')
const express = require('express')

const router = express.Router()
// eslint-disable-next-line no-undef
const { Bot, User} = require(`${process.cwd()}/src/db`)
const wrapper = require('express-debug-async-wrap')(debug)

router.post('/:UserId', wrapper( async (req, res) =>{
	const userId = req.params.UserId
	const user = await User.findOne({ where: { id: userId}})
	if (user === 0) {
		debug('User didn\'t exist')
	}
	else{
		//Si falla crear un nuevo Json
		const botJson = req.body
		botJson.User = userId
		const bot = await Bot.create(botJson)
		res.send(bot)
	}
	
}))

router.get('/', wrapper( async (req, res) =>{
	const bots = await Bot.findAll()
	res.send(bots)
}))

router.get('/:BotId', wrapper( async (req, res) =>{
	const bot = await Bot.findOne({ where: { id: req.params.BotId } })
	if (bot === 0) {
		res.sendStatus(404)
	}
	res.send(bot)
}))

router.put('/:BotId',  wrapper( async (req, res) =>{
	const bot = await Bot.update({where: {id: req.params.BotId}}, req.body)
	if (bot === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(bot)
	}
}))

router.delete()