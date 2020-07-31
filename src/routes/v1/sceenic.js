const debug = require('debug')('backend:routes:sceenic')
const express = require('express')

const router = express.Router()
// eslint-disable-next-line no-undef
const wrapper = require('express-debug-async-wrap')(debug)

const jwt = require('jsonwebtoken')
const axios = require('axios')

router.get('/', wrapper( async (req, res) =>{
	const data = {
		// eslint-disable-next-line no-undef
		'api_key': process.env.SCEENIC_API_KEY,
		'method': 'token',
		'params': {}
	}
	// eslint-disable-next-line no-undef
	const jwt_token = jwt.sign({'exp': Date.now()+30000 ,'data':data}, process.env.SCEENIC_API_SECRET, { algorithm: 'HS256'})
	const config = {
		headers: {
			'X-ReqToken': jwt_token,
		}
	}
	debug(jwt_token)
	// eslint-disable-next-line no-undef
	const respuesta = await axios.get(process.env.SCEENIC_CAS_URL+'/token', config)
	debug(respuesta)
	res.send(respuesta.data)
    
	
}))

module.exports = router