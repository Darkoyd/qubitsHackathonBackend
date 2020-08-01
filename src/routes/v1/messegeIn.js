const debug = require('debug')('backend:routes:messegeIn')
const express = require('express')
const { v4: uuidv4 } = require('uuid')

const router = express.Router()
// eslint-disable-next-line no-undef
const { MessegeIn, Inflow} = require(`${process.cwd()}/src/db`)
const wrapper = require('express-debug-async-wrap')(debug)

router.post('/:InflowId', wrapper( async (req, res) =>{
	const inflowId = req.params.InflowId
	const inflow = await Inflow.findOne({ where: { id: inflowId}})
	if (inflow === 0) {
		debug('Inflow didn\'t exist')
	}
	else{
		//Si falla crear un nuevo Json
		const messegeInJson = {
			id: uuidv4(),
			content: { message: req.body.content.message,
				inflowId: inflow.id
			},
			InflowId: inflowId
		}
		const messegeIn = await MessegeIn.create(messegeInJson)
		res.status(200).send(messegeIn)
	}
	
}))

router.get('/', wrapper( async (req, res) =>{
	const messegeIns = await MessegeIn.findAll()
	res.send(messegeIns)
}))

router.get('/:MessegeInId', wrapper( async (req, res) =>{
	const messegeIn = await MessegeIn.findOne({ where: { id: req.params.MessegeInId } })
	if (messegeIn === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(messegeIn)
	}
	
}))

router.put('/:MessegeInId',  wrapper( async (req, res) =>{
	const messegeIn = await MessegeIn.update({where: {id: req.params.MessegeInId}}, req.body)
	if (messegeIn === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(messegeIn)
	}
}))

router.delete('/:MessegeInId',  wrapper( async (req, res) =>{
	const result = await MessegeIn.destroy({where: {id: req.params.MessegeInId}})
	if (result === 0) {
		res.sendStatus(404)
	}
	else{
		res.sendStatus(200)
	}
}))

module.exports = router