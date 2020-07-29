const debug = require('debug')('backend:routes:page')
const express = require('express')
const { v4: uuidv4 } = require('uuid')

const router = express.Router()
// eslint-disable-next-line no-undef
const { Page, User} = require(`${process.cwd()}/src/db`)
const wrapper = require('express-debug-async-wrap')(debug)

router.post('/:UserId', wrapper( async (req, res) =>{
	const userId = req.params.UserId
	const user = await User.findOne({ where: { id: userId}})
	if (user === 0) {
		debug('User didn\'t exist')
	}
	else{
		//Si falla crear un nuevo Json
		const pageJson = {
			id: uuidv4(),
			name: req.body.name,
			url: req.body.url,
			facebookPageId: req.body.facebookPageId,
			appId: req.body.appId,
			pageAccessToken: req.body.pageAccessToken,
			appSecret: req.body.appSecret,
			UserId: userId,
		}
		const page = await Page.create(pageJson)
		res.send(page)
	}

}))

router.get('/:UserId', wrapper( async (req, res) =>{
	const pages = await Page.findAll({where: {UserId: req.params.UserId}})
	res.send(pages)
}))

router.get('/:PageId', wrapper( async (req, res) =>{
	const page = await Page.findOne({ where: { id: req.params.PageId } })
	if (page === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(page)
	}

}))

router.put('/:PageId',  wrapper( async (req, res) =>{
	const page = await Page.update({where: {id: req.params.PageId}}, req.body)
	if (page === 0) {
		res.sendStatus(404)
	}
	else{
		res.send(page)
	}
}))

router.delete('/:PageId',  wrapper( async (req, res) =>{
	const result = await Page.destroy({where: {id: req.params.PageId}})
	if (result === 0) {
		res.sendStatus(404)
	}
	else{
		res.sendStatus(200)
	}
}))

module.exports = router