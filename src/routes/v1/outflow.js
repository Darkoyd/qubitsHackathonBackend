const debug = require('debug')('backend:routes:outflow')
const express = require('express')
const {v4: uuidv4} = require('uuid')

const router = express.Router()
// eslint-disable-next-line no-undef
const { Outflow, Bot, Inflow} = require(`${process.cwd()}/src/db`)
const wrapper = require('express-debug-async-wrap')(debug)

router.post('/:BotId', wrapper( async (req, res) =>{
	const botId = req.params.BotId
	const bot = await Bot.findOne({ where: { id: botId}})
	if (bot === 0) {
		debug('Bot didn\'t exist')
	}
	else{
		//Si falla crear un nuevo Json
		const outflowJson = {
			id: uuidv4(),
			message: req.body.message,
			BotId: botId
		}
		const outflow = await Outflow.create(outflowJson)
		res.status(200).send(outflow)
	}

}))

router.get('/', wrapper( async (req, res) =>{
	const outflows = await Outflow.findAll()
	res.send(outflows)
}))

router.get('/:OutflowId', wrapper( async (req, res) =>{
	const outflow = await Outflow.findOne({ where: { id: req.params.OutflowId } })
	if (outflow === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(outflow)
	}

}))

router.put('/:OutflowId',  wrapper( async (req, res) =>{
	const outflow = await Outflow.update({where: {id: req.params.OutflowId}}, req.body)
	if (outflow === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(outflow)
	}
}))

router.put('/Previous/:PreviousId',  wrapper( async (req, res) =>{
	const outflow = await Outflow.findOne({where: {id: req.params.OutflowId}})
	if (outflow === 0) {
		res.sendStatus(404)
	}
	else{
		const botId = outflow.Bot
		const previous = await Inflow.findOne({ where: { id: req.params.PreviousId,  Bot: botId}})
		if (previous === 0) {
			res.sendStatus(401)
		}
		else{
			outflow.addInflow(previous)
			const updated = outflow.update()
			res.status(200).send(updated)
		}
		
	}
}))

router.delete('/:OutflowId',  wrapper( async (req, res) =>{
	const result = await Outflow.destroy({where: {id: req.params.OutflowId}})
	if (result === 0) {
		res.sendStatus(404)
	}
	else{
		res.sendStatus(200)
	}
}))

module.exports = router