const debug = require('debug')('backend:routes:inflow')
const express = require('express')
const {v4: uuidv4} = require('uuid')

const router = express.Router()
// eslint-disable-next-line no-undef
const { Inflow, Bot, Outflow} = require(`${process.cwd()}/src/db`)
const wrapper = require('express-debug-async-wrap')(debug)

router.post('/:BotId', wrapper( async (req, res) =>{
	const botId = req.params.BotId
	const bot = await Bot.findOne({ where: { id: botId}})
	if (bot === 0) {
		debug('Bot didn\'t exist')
	}
	else{
		//Si falla crear un nuevo Json
		const inflowJson = {
			id: uuidv4(),
			BotId: botId
		}
		const inflow = await Inflow.create(inflowJson)
		res.status(200).send(inflow)
	}
}))

router.get('/', wrapper( async (req, res) =>{
	const inflows = await Inflow.findAll()
	res.send(inflows)
}))

router.get('/:InflowId', wrapper( async (req, res) =>{
	const inflow = await Inflow.findOne({ where: { id: req.params.InflowId } })
	if (inflow === 0) {
		res.sendStatus(404)
	}
	else {
		res.send(inflow)
	}

}))

router.put('/:InflowId',  wrapper( async (req, res) =>{
	const inflow = await Inflow.update({where: {id: req.params.InflowId}}, req.body)
	if (inflow === 0) {
		res.sendStatus(404)
	}
	else {
		res.send(inflow)
	}
}))

router.put('/:InflowId/Previous/:PreviousId',  wrapper( async (req, res) =>{
	const inflow = await Inflow.findOne({where: {id: req.params.InflowId}})
	if (inflow === 0) {
		res.sendStatus(404)
	}
	else {
		const botId = inflow.BotId
		const previous = await Outflow.findOne({ where: { id: req.params.PreviousId,  BotId: botId}})
		if (previous === 0) {
			res.sendStatus(401)
		}
		else {
			inflow.addOutflow(previous)
			const updated = inflow.update()
			res.status(200).send(updated)
		}

	}
}))

router.delete('/:InflowId',  wrapper( async (req, res) =>{
	const result = await Inflow.destroy({where: {id: req.params.InflowId}})
	if (result === 0) {
		res.sendStatus(404)
	}
	else {
		res.sendStatus(200)
	}
}))

module.exports = router