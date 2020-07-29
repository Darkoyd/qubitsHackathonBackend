const debug = require('debug')('backend:routes:interactionIn')
const express = require('express')
const { v4: uuidv4 } = require('uuid')

const router = express.Router()
// eslint-disable-next-line no-undef
const { InteractionIn, MessegeIn} = require(`${process.cwd()}/src/db`)
const wrapper = require('express-debug-async-wrap')(debug)

router.post('/:MessegeInId', wrapper( async (req, res) =>{
	const messegeInId = req.params.MessegeInId
	const messegeIn = await MessegeIn.findOne({ where: { id: messegeInId}})
	if (messegeIn === 0) {
		debug('MessegeIn didn\'t exist')
	}
	else{
		//Si falla crear un nuevo Json
		const interactionInJson = {
			id: uuidv4(),
			facebookName: req.body.facebookName,
			data: req.body.data,
			MessegeInId: messegeInId
		}
		const interactionIn = await InteractionIn.create(interactionInJson)
		res.status(200).send(interactionIn)
	}

}))

router.get('/', wrapper( async (req, res) =>{
	const interactionIns = await InteractionIn.findAll()
	res.send(interactionIns)
}))

router.get('/:InteractionInId', wrapper( async (req, res) =>{
	const interactionIn = await InteractionIn.findOne({ where: { id: req.params.InteractionInId } })
	if (interactionIn === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(interactionIn)
	}
	
}))

router.put('/:InteractionInId',  wrapper( async (req, res) =>{
	const interactionIn = await InteractionIn.update({where: {id: req.params.InteractionInId}}, req.body)
	if (interactionIn === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(interactionIn)
	}
}))

router.delete('/:InteractionInId',  wrapper( async (req, res) =>{
	const result = await InteractionIn.destroy({where: {id: req.params.InteractionInId}})
	if (result === 0) {
		res.sendStatus(404)
	}
	else{
		res.sendStatus(200)
	}
}))

module.exports = router