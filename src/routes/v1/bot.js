const debug = require('debug')('backend:routes:bot')
const express = require('express')
const {v4: uuidv4} = require('uuid')

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
		const botJson = {
			id: uuidv4(),
			name:req.body.name,
			UserId: userId,
			PageId: req.body.pageId
		}
		const bot = await Bot.create(botJson)
		res.status(200).send(bot)
	}

}))

router.get('/:PageId', wrapper(async (req, res) => {
	const bots = await Bot.findAll({where: {PageId: req.params.PageId}})
	res.send(bots)
}))

router.get('/:UserId', wrapper( async (req, res) =>{
	const bots = await Bot.findAll({ where: { UserId: req.params.UserId }})
	res.send(bots)
}))

router.get('/:BotId', wrapper( async (req, res) =>{
	const bot = await Bot.findOne({ where: { id: req.params.BotId, UserId: req.body.UserId } })
	if (bot === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(bot)
	}
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

router.delete('/:BotId',  wrapper( async (req, res) =>{
	const result = await Bot.destroy({where: {id: req.params.BotId}})
	if (result === 0) {
		res.sendStatus(404)
	}
	else{
		res.sendStatus(200)
	}
}))

module.exports = router