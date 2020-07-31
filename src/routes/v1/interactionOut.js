const debug = require('debug')('backend:routes:interactionOut')
const express = require('express')
const { v4: uuidv4 } = require('uuid')

const router = express.Router()
// eslint-disable-next-line no-undef
const { InteractionOut, MessegeOut} = require(`${process.cwd()}/src/db`)
const wrapper = require('express-debug-async-wrap')(debug)

router.post('/:MessegeOutId', wrapper( async (req, res) =>{
	const messegeOutId = req.params.MessegeOutId
	const messegeOut = await MessegeOut.findOne({ where: { id: messegeOutId}})
	if (messegeOut === 0) {
		debug('MessegeOut didn\'t exist')
	}
	else{
		//Si falla crear un nuevo Json
		const interactionOutJson = {
			id: uuidv4(),
			psId: req.body.psId,
			data: req.body.data,
			MessegeInId: messegeOutId
		}
		const interactionOut = await InteractionOut.create(interactionOutJson)
		res.status(200).send(interactionOut)
	}

}))

router.get('/', wrapper( async (req, res) =>{
	const interactionOuts = await InteractionOut.findAll()
	res.send(interactionOuts)
}))

router.get('/:InteractionOutId', wrapper( async (req, res) =>{
	const interactionOut = await InteractionOut.findOne({ where: { id: req.params.InteractionOutId } })
	if (interactionOut === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(interactionOut)
	}
	
}))

router.put('/:InteractionOutId',  wrapper( async (req, res) =>{
	const interactionOut = await InteractionOut.update({where: {id: req.params.InteractionOutId}}, req.body)
	if (interactionOut === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(interactionOut)
	}
}))

router.delete('/:InteractionOutId',  wrapper( async (req, res) =>{
	const result = await InteractionOut.destroy({where: {id: req.params.InteractionOutId}})
	if (result === 0) {
		res.sendStatus(404)
	}
	else{
		res.sendStatus(200)
	}
}))

module.exports = router