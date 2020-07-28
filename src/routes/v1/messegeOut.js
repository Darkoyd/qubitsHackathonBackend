const debug = require('debug')('backend:routes:messegeOut')
const express = require('express')

const router = express.Router()
// eslint-disable-next-line no-undef
const { MessegeOut, Outflow} = require(`${process.cwd()}/src/db`)
const wrapper = require('express-debug-async-wrap')(debug)

router.post('/:OutflowId', wrapper( async (req, res) =>{
	const outflowId = req.params.OutflowId
	const outflow = await Outflow.findOne({ where: { id: outflowId}})
	if (outflow === 0) {
		debug('Outflow didn\'t exist')
	}
	else{
		//Si falla crear un nuevo Json
		const messegeOutJson = req.body
		messegeOutJson.Outflow = outflowId
		const messegeOut = await MessegeOut.create(messegeOutJson)
		res.send(messegeOut)
	}
	
}))

router.get('/', wrapper( async (req, res) =>{
	const messegeOuts = await MessegeOut.findAll()
	res.send(messegeOuts)
}))

router.get('/:MessegeOutId', wrapper( async (req, res) =>{
	const messegeOut = await MessegeOut.findOne({ where: { id: req.params.MessegeOutId } })
	if (messegeOut === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(messegeOut)
	}
	
}))

router.put('/:MessegeOutId',  wrapper( async (req, res) =>{
	const messegeOut = await MessegeOut.update({where: {id: req.params.MessegeOutId}}, req.body)
	if (messegeOut === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(messegeOut)
	}
}))

router.delete('/:MessegeOutId',  wrapper( async (req, res) =>{
	const result = await MessegeOut.destroy({where: {id: req.params.MessegeOutId}})
	if (result === 0) {
		res.sendStatus(404)
	}
	else{
		res.sendStatus(200)
	}
}))

module.exports = router